import { Request, Response } from "express";
import { StatsService } from "./stats.service";

const getStats = async (req: Request, res: Response) => {
  const user = (req as any).user;
  let result;

  if (user.role === "ADMIN") {
    result = await StatsService.getAdminStatsFromDB();
  } else if (user.role === "PROVIDER") {
    result = await StatsService.getProviderStatsFromDB(user.id);
  }

  res.status(200).json({
    success: true,
    message: "Statistics retrieved successfully",
    data: result
  });
};

export const StatsController = { getStats };