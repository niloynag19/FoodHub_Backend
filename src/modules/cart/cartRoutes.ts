import { Router } from "express";
import { CartController } from "./cartController";


const router = Router();

router.post("/add", CartController.addItemToCart);
router.get("/:userId", CartController.getUserCart);
router.delete("/:itemId", CartController.removeCartItem);

export const CartRoutes = router;