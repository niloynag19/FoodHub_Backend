import { Request, Response } from "express";
import { CartService } from "./cartServices";

const addItemToCart = async (req: Request, res: Response) => {
  try {
    
    const userId = (req as any).user?.id; 
    
    const { mealId, quantity, price } = req.body;

    const result = await CartService.addToCartIntoDB(userId, mealId, quantity, price);
    
    res.status(200).json({ 
      success: true, 
      message: "Item added to cart successfully",
      data: result 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};;


const getUserCart = async (req: Request, res: Response) => {
  try {
    
    const userId = (req as any).user?.id; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized! Please login." });
    }

    const result = await CartService.getCartFromDB(userId);
    
    res.status(200).json({ 
      success: true, 
      message: "Cart fetched successfully",
      data: result 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    await CartService.removeFromCartFromDB(itemId as string);
    res.status(200).json({ success: true, message: "Item removed successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const CartController = {
  addItemToCart,
  getUserCart,
  removeCartItem,
};