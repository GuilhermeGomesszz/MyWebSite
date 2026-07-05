import express from "express";
import authMiddleware from "../middleware/middlewares.js";

import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
} from "../controller/cart.js";

const router = express.Router();

// Sacola
router.post("/api/cart/adicionar", authMiddleware, addToCart);
router.get("/api/cart", authMiddleware, getCart);

// Item
router.put("/api/cart/:id", authMiddleware, updateCartItem);
router.delete("/api/cart/:id", authMiddleware, removeCartItem);

export default router;
