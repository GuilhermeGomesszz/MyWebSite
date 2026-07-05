import express from "express";

const router = express.Router()

import authMiddleware from "../middleware/middlewares.js";

import { authorizeRoles, updateAppointment, createAppointment, deleteAppointment, getAppointmentById, getAppointments } from "../controller/appointmentsController.js";


router.post(
  "/api/appointments",
  authMiddleware,
  authorizeRoles("CLIENT"),
  createAppointment
);

router.put(
  "/api/appointments/:id",
  authMiddleware,
  authorizeRoles("BARBER", "ADMIN"),
  updateAppointment
);

router.delete(
  "/api/appointments/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteAppointment
);

router.get(
  "/api/appointments",
  authMiddleware,
  authorizeRoles("ADMIN", "BARBER", "CLIENT"),
  getAppointments
);

router.get(
  "/api/appointments/:id",
  authMiddleware,
  getAppointmentById
);

export default router;
