import express from "express";



import {register, login, logout} from "../controller/autControllers.js"

const router = express.Router();

router.post("/api/regi", register);
router.post("/api/login", login);
router.post("/api/logout", logout);

export default router