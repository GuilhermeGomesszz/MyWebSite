import { prisma } from "../config/db.js"; // Garanta que o caminho do seu arquivo de banco está correto

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.status(200).json({
            status: "success",
            data: user
        });

    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar perfil" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Converte para número e valida se realmente virou um número válido
        const userId = Number(id);
        if (!id || isNaN(userId)) {
            return res.status(400).json({ message: "ID inválido ou não enviado" });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno" });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { search } = req.query;

        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: search || "", // Evita que quebre caso venha vazio
                    mode: "insensitive"
                }
            }
        });

        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar usuários" });
    }
};

export const getBarbers = async (req, res) => {
    try {
        const barbers = await prisma.user.findMany({
            where: {
                role: "BARBER"
            },
            select: {
                id: true,
                name: true,
                email: true,
                specialties: true
            },
            orderBy: {
                name: "asc"
            }
        });

        return res.json({
            status: "success",
            data: barbers
        });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar barbeiros" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                name: "asc"
            }
        });

        return res.json({
            status: "success",
            data: users
        });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar usuarios" });
    }
};

export const promoteToAdmin = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!userId || isNaN(userId)) {
            return res.status(400).json({ message: "ID invalido ou nao enviado" });
        }

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role: "ADMIN"
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        return res.json({
            status: "success",
            data: user
        });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao promover usuario" });
    }
};

export const onlyAdmin = (req, res, next) => {
    
    if (req.user.role !== "ADMIN") { 
        return res.status(403).json({ message: "Acesso negado" });
    }
    next();
};
