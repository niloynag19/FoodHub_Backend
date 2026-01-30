import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { ReviewController } from "./reviewController";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), ReviewController.createReview);
router.get("/:mealId", ReviewController.getMealReviews);

export const ReviewRoutes = router;