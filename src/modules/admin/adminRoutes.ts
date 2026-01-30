import express from "express";

import auth, { UserRole } from "../../middlewares/auth";
import { AdminController } from "./adminController";

const router = express.Router();


router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.get("/stats", auth(UserRole.ADMIN), AdminController.getStats);
router.delete("/meals/:id", auth(UserRole.ADMIN), AdminController.deleteMeal);

export const AdminRoutes = router;