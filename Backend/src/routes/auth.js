import express from "express";
import {
  logout,
  signin,
  signup,
  onboarding,
} from "../controller/authController.js";
import { protectRoute } from "../middleware/auth_middleware.js";
const router = express.Router();
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/onboarding", protectRoute, onboarding);
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
export default router;
