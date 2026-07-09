import prisma from "../config/db.js"
import bcrypt from "bcrypt"
import generateToken from "../jwtVerification/jwtToken.js";
import { clearCachePattern, cache } from "../middleware/cache.js";
import { Resend } from "resend";
import crypto from "crypto";

import {registerSchema} from "../validators/authSchema.js"
import { loginSchema } from "../validators/loginSchema.js";


export const register = async (req, res) => {
 
    const result = registerSchema.safeParse(req.body);
 
    if (!result.success) {
        return res.status(400).json({
            message: "Dados inválidos",
            errors: result.error.format()
        });
    }
 
    const { email, name, password, role, phone, specialties } = result.data;
 
    try {
        const checkEmail = await prisma.user.findUnique({
            where: { email }
        });
 
        if (checkEmail) {
            return res.status(400).json({ message: "email já cadastrado" });
        }
 
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
 
        const creating = await prisma.user.create({
            data: {
                email,
                password: hashed,
                name,
                role,
                phone,
                specialties
            }
        });
 
        clearCachePattern("/api/users");
        clearCachePattern("/api/barbers");

        // Antes: generateToken(creating.id, res) -> "res" virava "role" dentro da função,
        // e "res" ficava undefined, quebrando o res.cookie() e caindo no catch.
        const token = generateToken(creating.id, role, res);
 
        return res.status(201).json({
            status: "success",
            data: {
                email,
                name,
                token,
                userId: creating.id
            }
        });
 
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return res.status(400).json({ message: "registro falhado", error: error.message });
    }
};

export const login = async (req, res) => {
    try {

        // 1. VALIDAR INPUT COM ZOD
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Dados inválidos",
                errors: result.error.format()
            });
        }

        const { email, password } = result.data;

        // 2. BUSCAR USUÁRIO
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({
                message: "Usuário não encontrado"
            });
        }

        // 3. VALIDAR SENHA
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Senha incorreta"
            });
        }

        // 4. GERAR TOKEN (ID + ROLE)
        const token = generateToken(user.id, user.role, res);

        // 5. RESPOSTA
        return res.status(200).json({
            status: "success",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({
            message: "Erro no login",
            error: error.message
        });
    }
};


export const logout = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({message: "logout successful"});
};

// Inicializa o cliente do Resend caso a chave exista e não seja a dummy padrão
const resendKey = process.env.RESEND_API_KEY;
const isDummyKey = !resendKey || resendKey === "sua-chave-do-resend" || resendKey.includes("placeholder");
const resend = isDummyKey ? null : new Resend(resendKey);

// ============================================
// POST /api/forgot-password - Solicita código de recuperação
// ============================================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "E-mail é obrigatório." });
        }

        // Verificar se usuário existe
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado com este e-mail." });
        }

        // Gerar código aleatório de 6 dígitos
        const code = crypto.randomInt(100000, 999999).toString();

        // Salvar código no cache temporário com expiração em 5 minutos (300 segundos)
        cache.set(`reset_${email}`, code, 300);

        // Enviar o e-mail
        if (resend) {
            try {
                await resend.emails.send({
                    from: "onboarding@resend.dev", // Domínio padrão de testes do Resend
                    to: email,
                    subject: "Código de Recuperação de Senha - BarberShop",
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                            <h2 style="color: #c9a84c; text-align: center;">Recuperação de Senha</h2>
                            <p>Olá, <strong>${user.name}</strong>,</p>
                            <p>Você solicitou a redefinição de senha para sua conta no BarberShop. Use o código abaixo para prosseguir:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="background: #f4f4f4; padding: 12px 24px; font-size: 24px; font-weight: bold; border-radius: 4px; letter-spacing: 4px; border: 1px dashed #c9a84c;">${code}</span>
                            </div>
                            <p style="color: #666; font-size: 14px;"><strong>Nota:</strong> Este código expira em 5 minutos.</p>
                            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #999; text-align: center;">Se você não solicitou isso, pode ignorar este e-mail com segurança.</p>
                        </div>
                    `
                });
                console.log(`[Resend] E-mail enviado com sucesso para ${email}`);
            } catch (err) {
                console.error("❌ Erro ao enviar e-mail via Resend:", err);
                // Fallback para desenvolvimento
                console.log("\n==================================================");
                console.log(`[EMAIL SEND FALLBACK] Código de recuperação para ${email}: ${code}`);
                console.log("==================================================\n");
            }
        } else {
            console.log("\n==================================================");
            console.log(`[DEV MODE] Código de recuperação para ${email}: ${code}`);
            console.log("==================================================\n");
        }

        return res.status(200).json({
            status: "success",
            message: "Código de recuperação enviado com sucesso."
        });

    } catch (error) {
        console.error("❌ Erro no forgotPassword:", error);
        return res.status(500).json({ message: "Erro ao processar solicitação de recuperação." });
    }
};

// ============================================
// POST /api/reset-password - Valida código e redefine senha
// ============================================
export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: "E-mail, código e nova senha são obrigatórios." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "A nova senha deve ter no mínimo 6 caracteres." });
        }

        // Buscar código no cache
        const cachedCode = cache.get(`reset_${email}`);

        if (!cachedCode) {
            return res.status(400).json({ message: "Código expirado ou inválido. Solicite um novo código." });
        }

        if (cachedCode !== code) {
            return res.status(400).json({ message: "Código de verificação incorreto." });
        }

        // Criptografar nova senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Atualizar no banco de dados
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        // Limpar o código do cache para não ser reutilizado
        cache.del(`reset_${email}`);

        return res.status(200).json({
            status: "success",
            message: "Senha redefinida com sucesso."
        });

    } catch (error) {
        console.error("❌ Erro no resetPassword:", error);
        return res.status(500).json({ message: "Erro ao redefinir senha." });
    }
};

