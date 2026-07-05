import express from "express";
import { getServices } from "../controller/servicesController.js";
import authMiddleware from "../middleware/middlewares.js";

const router = express.Router();

router.get("/api/services", authMiddleware,getServices);

export default router;