import { Router } from "express";
import { CartController } from "./cartController";
import auth, { UserRole } from "../../middlewares/auth";


const router = Router();

router.post("/add",auth(UserRole.CUSTOMER), CartController.addItemToCart);
router.get("/:userId",auth(UserRole.CUSTOMER), CartController.getUserCart);
router.delete("/:itemId",auth(UserRole.CUSTOMER), CartController.removeCartItem);

export const CartRoutes = router;