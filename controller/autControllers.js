import prisma from "../config/db.js"
import bcrypt from "bcrypt"
import generateToken from "../jwtVerification/jwtToken.js";

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
        return res.status(400).json({ message: "registro falhado" });
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
}

