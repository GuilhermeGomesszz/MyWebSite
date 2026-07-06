import express from "express";
import {
    getBarbers,
    getProfile,
    getUsers,
    getUserById,
    onlyAdmin,
    promoteToAdmin,
    searchUsers
} from "../controller/getProfile.js";
import authMiddleware from "../middleware/middlewares.js";
import { cacheMiddleware } from "../middleware/cache.js";

const router = express.Router();

// 📋 ROTAS DE PERFIL E USUÁRIOS - SEM PREFIXO

// ✅ GET /profile - Perfil do usuário logado
router.get("/profile", authMiddleware,  getProfile);

// ✅ GET /barbers - Listar barbeiros
router.get("/barbers", authMiddleware, cacheMiddleware(300), getBarbers);

// ✅ GET /users/search - Buscar usuários (DEVE VIR ANTES DO /:id)
router.get("/users/search", authMiddleware, searchUsers);

// ✅ GET /users - Listar todos os usuários (apenas ADMIN)
router.get("/users", authMiddleware, onlyAdmin, cacheMiddleware(300), getUsers);

// ✅ PATCH /users/:id/promote-admin - Promover a admin (apenas ADMIN)
router.patch(
    "/users/:id/promote-admin", 
    authMiddleware, 
    onlyAdmin,  
    promoteToAdmin
);

// ✅ GET /users/:id - Buscar usuário por ID (DEVE VIR POR ÚLTIMO)
router.get("/users/:id", authMiddleware,  getUserById);

export default router;