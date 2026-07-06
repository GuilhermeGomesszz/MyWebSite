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
router.get("/cart", authMiddleware, getCart);
router.post("/cart/add", authMiddleware, addToCart);
router.put("/cart/:id", authMiddleware, updateCartItem);
router.delete("/cart/:id", authMiddleware, removeCartItem);



export default router;
