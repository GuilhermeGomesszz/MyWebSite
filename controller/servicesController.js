import prisma from "../config/db.js";
import { serviceSchema } from "../validators/serviceSchema.js";

// GET /api/services - lista todos os servicos
export const getServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: { createdAt: "desc" }
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

// POST /api/services - cria um servico (ADMIN)
export const createService = async (req, res) => {
    try {
        const validation = serviceSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "Dados inválidos",
                errors: validation.error.issues.map(err => ({
                    field: err.path.join("."),
                    message: err.message
                }))
            });
        }

        const { name, description, durationMinutes, priceInCents } = validation.data;

        const service = await prisma.service.create({
            data: { name, description, durationMinutes, priceInCents }
        });

        return res.status(201).json({
            status: "success",
            data: service
        });
    } catch (error) {
        console.error("Erro ao criar serviço:", error);
        return res.status(500).json({ message: "Erro ao criar serviço" });
    }
};

// PUT /api/services/:id - atualiza um servico (ADMIN)
export const updateService = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const existing = await prisma.service.findUnique({ where: { id } });

        if (!existing) {
            return res.status(404).json({ message: "Serviço não encontrado" });
        }

        const validation = serviceSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "Dados inválidos",
                errors: validation.error.issues.map(err => ({
                    field: err.path.join("."),
                    message: err.message
                }))
            });
        }

        const { name, description, durationMinutes, priceInCents } = validation.data;

        const service = await prisma.service.update({
            where: { id },
            data: { name, description, durationMinutes, priceInCents }
        });

        return res.json({
            status: "success",
            data: service
        });
    } catch (error) {
        console.error("Erro ao atualizar serviço:", error);
        return res.status(500).json({ message: "Erro ao atualizar serviço" });
    }
};

// DELETE /api/services/:id - deleta um servico (ADMIN)
export const deleteService = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const existing = await prisma.service.findUnique({ where: { id } });

        if (!existing) {
            return res.status(404).json({ message: "Serviço não encontrado" });
        }

        await prisma.service.delete({ where: { id } });

        return res.json({
            status: "success",
            message: "Serviço removido com sucesso"
        });
    } catch (error) {
        console.error("Erro ao deletar serviço:", error);
        return res.status(500).json({ message: "Erro ao deletar serviço" });
    }
};
