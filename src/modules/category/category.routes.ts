import express from "express";
import { CategoryController } from "./category.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), CategoryController.createCategory);

router.patch("/:id", auth(UserRole.ADMIN), CategoryController.updateCategory);

router.delete("/:id", auth(UserRole.ADMIN), CategoryController.deleteCategory);

router.get("/", CategoryController.getAllCategories);

export const CategoryRoutes = router;