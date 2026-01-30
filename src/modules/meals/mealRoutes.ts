import express from "express";

import auth, { UserRole } from "../../middlewares/auth";
import { MealController } from "./mealController";

const router = express.Router();

router.get("/", MealController.getAllMeals); 

router.get("/:id", MealController.getMealDetails);

router.post("/add-meal", auth(UserRole.PROVIDER), MealController.createMeal);

router.patch("/:id", auth(UserRole.PROVIDER), MealController.updateMeal);

router.delete("/:id", auth(UserRole.PROVIDER), MealController.deleteMeal);

export const MealRoutes = router;