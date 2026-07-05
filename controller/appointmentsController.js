import { prisma } from "../config/db.js"; // Ajuste o caminho do seu prisma se necessário
import { appointmentSchema } from "../validators/appointmentsSchema.js";

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Acesso negado"
            });
        }

        next();
    };
};

export const createAppointment = async (req, res) => {
    try {
        const clientId = req.user.id;

        // 1. Validação dos dados do body com o Zod
        const validation = appointmentSchema.safeParse(req.body);

        // Se a validação falhar, retorna os erros detalhados
        if (!validation.success) {
            return res.status(400).json({
                message: "Dados de agendamento inválidos",
                errors: validation.error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }

        // Dados validados e tipados pelo Zod
        const { barberId, serviceId, scheduledAt, notes } = validation.data;

        // 2. Validação das regras de negócio no banco
        const barber = await prisma.user.findUnique({
            where: { id: barberId }
        });

        if (!barber || barber.role !== "BARBER") {
            return res.status(400).json({ message: "Barbeiro inválido" });
        }

        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        });

        if (!service) {
            return res.status(400).json({ message: "Serviço inválido" });
        }

        // 3. Criação do agendamento (convertendo a string do datetime para objeto Date)
        const appointment = await prisma.appointment.create({
            data: {
                barberId,
                clientId,
                serviceId,
                scheduledAt: new Date(scheduledAt),
                notes
            }
        });

        return res.status(201).json({
            status: "success",
            data: appointment
        });

    } catch (error) {
        console.error("Erro no createAppointment:", error);
        return res.status(500).json({ message: "Erro ao criar agendamento" });
    }
};

export const getAppointments = async (req, res) => {
    try {
        const { id, role } = req.user;
        let where = {};

        if (role === "CLIENT") {
            where.clientId = id;
        }

        if (role === "BARBER") {
            where.barberId = id;
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                service: true,
                barber: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                scheduledAt: "asc"
            }
        });

        return res.json({
            status: "success",
            data: appointments
        });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar agendamentos" });
    }
};

export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await prisma.appointment.findUnique({
            where: { id: Number(id) },
            include: {
                service: true,
                barber: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        if (!appointment) {
            return res.status(404).json({ message: "Não encontrado" });
        }

        return res.json(appointment);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar agendamento" });
    }
};

export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const appointmentId = Number(id);

        if (!appointmentId || isNaN(appointmentId)) {
            return res.status(400).json({ message: "ID invalido ou nao enviado" });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!appointment) {
            return res.status(404).json({ message: "Agendamento nao encontrado" });
        }

        if (req.user.role === "BARBER" && appointment.barberId !== req.user.id) {
            return res.status(403).json({ message: "Acesso negado" });
        }

        const updated = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status }
        });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar agendamento" });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.appointment.delete({
            where: { id: Number(id) }
        });

        return res.json({ message: "Deletado com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao deletar agendamento" });
    }
};

