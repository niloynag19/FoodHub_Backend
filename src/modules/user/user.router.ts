import express from "express";
import { UserController } from "./user.controller";
import auth, { UserRole } from "../../middlewares/auth";


const router = express.Router();

router.post("/register", UserController.registerUser);

router.post("/login", UserController.loginUser);

router.get("/",auth(UserRole.ADMIN),UserController.getAllUsers);

router.get("/me", auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), UserController.getMyProfile);

router.patch("/admin/users/:id", auth(UserRole.ADMIN), UserController.updateUserStatus);

export const UserRoutes = router;