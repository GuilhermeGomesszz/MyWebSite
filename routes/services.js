import express from "express";
import { getServices, createService, updateService, deleteService } from "../controller/servicesController.js";
import authMiddleware from "../middleware/middlewares.js";
import { onlyAdmin } from "../controller/getProfile.js";

const router = express.Router();

// Qualquer usuario logado pode ver servicos
router.get("/api/services", authMiddleware, getServices);

// Apenas ADMIN pode criar, editar e deletar
router.post("/api/services", authMiddleware, onlyAdmin, createService);
router.put("/api/services/:id", authMiddleware, onlyAdmin, updateService);
router.delete("/api/services/:id", authMiddleware, onlyAdmin, deleteService);

export default router;
