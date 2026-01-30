import { Request, Response } from "express";
import { AdminService } from "./adminService";


const getAllUsers = async (req: Request, res: Response) => {
  const role = req.query.role as string;
  const result = await AdminService.getAllUsersFromDB(role);
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: result
  });
};

const getStats = async (req: Request, res: Response) => {
  const result = await AdminService.getAdminDashboardStats();
  res.status(200).json({
    success: true,
    message: "Admin stats retrieved successfully",
    data: result
  });
};

const deleteMeal = async (req: Request, res: Response) => {
  await AdminService.deleteAnyMealFromDB(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Meal deleted successfully by Admin"
  });
};

export const AdminController = {
  getAllUsers,
  getStats,
  deleteMeal
};