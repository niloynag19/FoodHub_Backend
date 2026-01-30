import { Request, Response } from "express";
import { ReviewService } from "./reviewServices";

const createReview = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await ReviewService.createReviewIntoDB(user.id, req.body);
  res.status(201).json({ success: true, message: "Review added!", data: result });
};

const getMealReviews = async (req: Request, res: Response) => {
  const { mealId } = req.params;
  const result = await ReviewService.getMealReviewsFromDB(mealId as string);
  res.status(200).json({ success: true, data: result });
};

export const ReviewController = { createReview, getMealReviews };