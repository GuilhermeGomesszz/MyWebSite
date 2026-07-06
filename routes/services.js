import express from "express";
import { getServices, createService, updateService, deleteService } from "../controller/servicesController.js";
import authMiddleware from "../middleware/middlewares.js";
import { onlyAdmin } from "../controller/getProfile.js";
import { cacheMiddleware } from "../middleware/cache.js";


const router = express.Router();

// 📋 ROTAS DE SERVIÇOS - URLs mais limpas

// ✅ GET /services - Listar serviços publicamente
router.get("/", cacheMiddleware(300), getServices);

// ✅ POST /services - Criar serviço (apenas ADMIN)
router.post(
    "/", 
    authMiddleware, 
    onlyAdmin,  
    createService
);

// ✅ PUT /services/:id - Atualizar serviço (apenas ADMIN)
router.put(
    "/:id", 
    authMiddleware, 
    onlyAdmin,  
    updateService
);

// ✅ DELETE /services/:id - Remover serviço (apenas ADMIN)
router.delete(
    "/:id", 
    authMiddleware, 
    onlyAdmin,   
    deleteService
);
export default router;
