import prisma from "../config/db.js";

export const getServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            status: "success",
            data: services
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: "error",
            message: "Erro ao buscar serviços"
        });
    }
};