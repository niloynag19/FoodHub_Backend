import { Request, Response } from "express";
import { CategoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        const result = await CategoryService.createCategoryIntoDB(req.body);
        res.status(201).json({
            success: true,
            message: "Category created successfully!",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const result = await CategoryService.getAllCategoriesFromDB(req.query);
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            meta: result.meta,
            data: result.data,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};

const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await CategoryService.updateCategoryInDB(id as string, req.body);
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to update category",
        });
    }
};

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await CategoryService.deleteCategoryFromDB(id as string);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
        });
    }
};

export const CategoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};