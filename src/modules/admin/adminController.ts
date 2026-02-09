import { Request, Response } from "express";
import { AdminService } from "./adminService";


const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
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