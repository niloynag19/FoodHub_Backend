import express from "express";
import { OrderController } from "./orderController";
import auth, { UserRole } from "../../middlewares/auth";


const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), OrderController.createOrder);

router.get("/my-orders", auth(UserRole.CUSTOMER), OrderController.getMyOrders);

router.get("/", auth(UserRole.ADMIN,UserRole.PROVIDER), OrderController.getAllOrders);

export const OrderRoutes = router;