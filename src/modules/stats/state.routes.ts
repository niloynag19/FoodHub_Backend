import express from "express";
import { StatsController } from "./stats.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/", 
  auth(UserRole.ADMIN, UserRole.PROVIDER), 
  StatsController.getStats
);

export const StatsRoutes = router;