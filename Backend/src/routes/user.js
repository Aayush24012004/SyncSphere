import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequest,
} from "../controller/userController.js";
const router = express.Router();
router.use(protectRoute); //apply auth middleware to all the user routes
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friends-request/:id", sendFriendRequest);
router.get("/friends-request/:id/accept", acceptFriendRequest);

router.get("/friends-request/:id/accept", getFriendRequest);
export default router;
