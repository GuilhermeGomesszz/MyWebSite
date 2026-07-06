import express from "express";
import authMiddleware from "../middleware/middlewares.js";
import { 
    authorizeRoles, 
    updateAppointment, 
    createAppointment, 
    deleteAppointment, 
    getAppointmentById, 
    getAppointments 
} from "../controller/appointmentsController.js";

const router = express.Router(); // ✅ APENAS UMA VEZ

// 📋 ROTAS DE AGENDAMENTOS - URLs mais limpas

// POST /appointments - Criar agendamento
router.post(
    "/",
    authMiddleware,
    authorizeRoles("CLIENT"),
    createAppointment
);

// PUT /appointments/:id - Atualizar agendamento
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("BARBER", "ADMIN"),
    updateAppointment
);

// DELETE /appointments/:id - Remover agendamento
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    deleteAppointment
);

// GET /appointments - Listar agendamentos
router.get(
    "/",
    authMiddleware,
    authorizeRoles("ADMIN", "BARBER", "CLIENT"),
    getAppointments
);

// GET /appointments/:id - Buscar agendamento específico
router.get(
    "/:id",
    authMiddleware,
    getAppointmentById
);

export default router;
