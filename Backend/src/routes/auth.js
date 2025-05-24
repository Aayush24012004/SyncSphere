import express from "express";
import { logout, signin, signup } from "../controller/authController.js";
const router = express.Router();
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/signup", signup);
export default router;
