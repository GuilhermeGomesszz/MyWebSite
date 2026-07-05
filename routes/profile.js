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

const router = express.Router();

router.get("/api/profile", authMiddleware, getProfile);
router.get("/api/users/search", authMiddleware, searchUsers);
router.get("/api/barbers", authMiddleware, getBarbers);

/**
 * 🔥 rota fixa ANTES da dinâmica
 */
router.get("/api/users", authMiddleware, onlyAdmin, (req, res) => {
    return getUsers(req, res);
});

router.patch("/api/users/:id/promote-admin", authMiddleware, onlyAdmin, promoteToAdmin);

/**
 * 👤 rota dinâmica SEMPRE POR ÚLTIMO
 */
router.get("/api/users/:id", authMiddleware, getUserById);


export default router;
