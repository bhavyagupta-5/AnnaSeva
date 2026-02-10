import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import restrictTo from "../middleware/roleMiddleware.js";
import {
  createFoodPost,
  getMyFoodPosts,
  cancelFoodPost,
} from "../controllers/foodController.js";

const router = express.Router();

router.post("/create", protect, restrictTo("provider"), createFoodPost);
router.get("/my-posts", protect, restrictTo("provider"), getMyFoodPosts);
router.post("/cancel/:id", protect, restrictTo("provider"), cancelFoodPost);

export default router;
