import { prisma } from "../../lib/prisma";

const createReviewIntoDB = async (userId: string, payload: any) => {
  return await prisma.review.create({
    data: {
      rating: Number(payload.rating),
      comment: payload.comment,
      customerId: userId, 
      mealId: payload.mealId,
    },
  });
};

const getMealReviewsFromDB = async (mealId: string) => {
  return await prisma.review.findMany({
    where: { mealId },
    include: { 
      customer: { 
        select: { 
          name: true,
          image: true 
        } 
      } 
    },
    orderBy: { createdAt: "desc" }
  });
};

export const ReviewService = { createReviewIntoDB, getMealReviewsFromDB };