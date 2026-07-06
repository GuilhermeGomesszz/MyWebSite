import prisma from "../config/db.js";

// ============================================
// GET /api/barbers/:id/comments - Lista comentários de um barbeiro
// ============================================
export const getCommentsByBarber = async (req, res) => {
    try {
        const barberId = Number(req.params.id);

        if (!barberId || isNaN(barberId)) {
            return res.status(400).json({ message: "ID do barbeiro inválido." });
        }

        // Verificar se usuário existe e se é barbeiro ou admin
        const barber = await prisma.user.findUnique({
            where: { id: barberId }
        });

        if (!barber || !["BARBER", "ADMIN"].includes(barber.role)) {
            return res.status(404).json({ message: "Barbeiro não encontrado." });
        }

        const comments = await prisma.comment.findMany({
            where: { barberId },
            include: {
                client: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            status: "success",
            data: comments
        });
    } catch (error) {
        console.error("❌ Erro ao buscar comentários:", error);
        return res.status(500).json({ message: "Erro ao buscar comentários do barbeiro." });
    }
};

// ============================================
// POST /api/barbers/:id/comments - Cria comentário para um barbeiro
// ============================================
export const createComment = async (req, res) => {
    try {
        const barberId = Number(req.params.id);
        const clientId = req.user.id; // Recuperado do token via authMiddleware
        const { content, rating } = req.body;

        if (!barberId || isNaN(barberId)) {
            return res.status(400).json({ message: "ID do barbeiro inválido." });
        }

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "O comentário não pode ser vazio." });
        }

        const numRating = Number(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
            return res.status(400).json({ message: "A avaliação deve ser entre 1 e 5." });
        }

        // Verificar se o destinatário é barbeiro/admin
        const barber = await prisma.user.findUnique({
            where: { id: barberId }
        });

        if (!barber || !["BARBER", "ADMIN"].includes(barber.role)) {
            return res.status(400).json({ message: "O usuário avaliado precisa ser um barbeiro." });
        }

        // Criar o comentário no banco
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                rating: numRating,
                barberId,
                clientId
            },
            include: {
                client: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return res.status(201).json({
            status: "success",
            data: comment
        });
    } catch (error) {
        console.error("❌ Erro ao registrar comentário:", error);
        return res.status(500).json({ message: "Erro ao registrar o comentário." });
    }
};
