// src/controller/servicesController.js
import prisma from "../config/db.js";
import { serviceSchema } from "../validators/serviceSchema.js";
import { clearCachePattern } from "../middleware/cache.js";

// ============================================
// GET /api/services - Lista todos os serviços
// ============================================
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
        console.error("❌ Erro ao buscar serviços:", error);
        return res.status(500).json({
            status: "error",
            message: "Erro ao buscar serviços"
        });
    }
};

// ============================================
// POST /api/services - Cria um serviço (ADMIN)
// ============================================
export const createService = async (req, res) => {
    try {
        const validation = serviceSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Dados inválidos",
                errors: validation.error.issues.map(err => ({
                    field: err.path.join("."),
                    message: err.message
                }))
            });
        }

        const { name, description, durationMinutes, priceInCents } = validation.data;

        // Verificar se já existe serviço com mesmo nome
        const existing = await prisma.service.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive"
                }
            }
        });

        if (existing) {
            return res.status(409).json({
                status: "error",
                message: "Já existe um serviço com este nome"
            });
        }

        const service = await prisma.service.create({
            data: { 
                name, 
                description, 
                durationMinutes, 
                priceInCents 
            }
        });

        clearCachePattern("/api/services");

        return res.status(201).json({
            status: "success",
            data: service
        });
    } catch (error) {
        console.error("❌ Erro ao criar serviço:", error);
        return res.status(500).json({ 
            status: "error",
            message: "Erro ao criar serviço" 
        });
    }
};

// ============================================
// PUT /api/services/:id - Atualiza um serviço (ADMIN)
// ============================================
export const updateService = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({ 
                status: "error",
                message: "ID inválido" 
            });
        }

        const existing = await prisma.service.findUnique({ 
            where: { id } 
        });

        if (!existing) {
            return res.status(404).json({ 
                status: "error",
                message: "Serviço não encontrado" 
            });
        }

        const validation = serviceSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Dados inválidos",
                errors: validation.error.issues.map(err => ({
                    field: err.path.join("."),
                    message: err.message
                }))
            });
        }

        const { name, description, durationMinutes, priceInCents } = validation.data;

        // Verificar se nome já existe em outro serviço
        if (name !== existing.name) {
            const nameConflict = await prisma.service.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: "insensitive"
                    },
                    id: {
                        not: id
                    }
                }
            });

            if (nameConflict) {
                return res.status(409).json({
                    status: "error",
                    message: "Já existe outro serviço com este nome"
                });
            }
        }

        const service = await prisma.service.update({
            where: { id },
            data: { 
                name, 
                description, 
                durationMinutes, 
                priceInCents 
            }
        });

        clearCachePattern("/api/services");

        return res.status(200).json({
            status: "success",
            data: service
        });
    } catch (error) {
        console.error("❌ Erro ao atualizar serviço:", error);
        return res.status(500).json({ 
            status: "error",
            message: "Erro ao atualizar serviço" 
        });
    }
};

// ============================================
// DELETE /api/services/:id - Deleta um serviço (ADMIN)
// ============================================
export const deleteService = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({ 
                status: "error",
                message: "ID inválido" 
            });
        }

        const existing = await prisma.service.findUnique({ 
            where: { id },
            include: {
                appointments: {
                    where: {
                        status: { not: "CANCELLED" }
                    },
                    take: 1
                }
            }
        });

        if (!existing) {
            return res.status(404).json({ 
                status: "error",
                message: "Serviço não encontrado" 
            });
        }

        // Verificar se serviço está em uso
        if (existing.appointments.length > 0) {
            return res.status(409).json({
                status: "error",
                message: "Não é possível deletar um serviço que possui agendamentos ativos"
            });
        }

        await prisma.service.delete({ 
            where: { id } 
        });

        clearCachePattern("/api/services");

        return res.status(200).json({
            status: "success",
            message: "Serviço removido com sucesso"
        });
    } catch (error) {
        console.error("❌ Erro ao deletar serviço:", error);
        return res.status(500).json({ 
            status: "error",
            message: "Erro ao deletar serviço" 
        });
    }
};