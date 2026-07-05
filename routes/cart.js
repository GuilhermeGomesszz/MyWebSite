import express from "express";
import authMiddleware from "../middleware/middlewares.js";

import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
} from "../controller/cart.js";

const router = express.Router();

// 🧺 sacola
router.post("/adicionar", authMiddleware, addToCart);
router.get("/ver", authMiddleware, getCart);

// ✏️ item
router.put("/:id", authMiddleware, updateCartItem);
router.delete("/:id", authMiddleware, removeCartItem);

export default router;