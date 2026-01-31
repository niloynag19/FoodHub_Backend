import { Request, Response } from "express";
import { MealService } from "./mealService";


const createMeal = async (req: Request, res: Response) => {
    try {
        const providerId = (req as any).user.id;
        const result = await MealService.createMealIntoDB(req.body, providerId);
        res.status(201).json({ success: true, message: "Meal added successfully", data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Failed to create meal" });
    }
};

const getAllMeals = async (req: Request, res: Response) => {
    try {
        const result = await MealService.getAllMealsFromDB(req.query);
        res.status(200).json({ success: true, message: "Meals retrieved successfully", meta: result.meta, data: result.data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateMeal = async (req: Request, res: Response) => {
    try {
        const user = req.user as { id: string; role: string };
        const userId = user.id;
        const mealId = req.params.id;
        const payload = req.body;

        const result = await MealService.updateMealInDB(mealId as string, userId, payload);

        res.status(200).json({
            success: true,
            message: "Meal updated successfully",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update meal"
        });
    }
};

const deleteMeal = async (req: Request, res: Response) => {
    try {
        await MealService.deleteMealFromDB(req.params.id as string, (req as any).user.id);
        res.status(200).json({ success: true, message: "Meal deleted successfully" });
    } catch (error: any) {
        res.status(403).json({ success: false, message: "Unauthorized or Meal not found" });
    }
};

const getMealDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await MealService.getSingleMealFromDB(id as string);

        if (!result) {
            return res.status(404).json({ success: false, message: "Meal not found!" });
        }

        res.status(200).json({
            success: true,
            message: "Meal details retrieved successfully",
            data: result
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const MealController = {
    createMeal,
    getAllMeals,
    updateMeal,
    deleteMeal,
    getMealDetails
};


