import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import restrictTo from "../middleware/roleMiddleware.js";
import {
  nearbyFood,
  acceptPickup,
  markDelivered,
} from "../controllers/volunteerController.js";

const router = express.Router();

router.get("/nearby", protect, restrictTo("volunteer"), nearbyFood);
router.post("/accept/:id", protect, restrictTo("volunteer"), acceptPickup);
router.post("/deliver/:id", protect, restrictTo("volunteer"), markDelivered);

export default router;
