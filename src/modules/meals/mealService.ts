import { prisma } from "../../lib/prisma";

const getProviderIdByUserId = async (userId: string) => {
    const provider = await prisma.providerProfile.findUnique({
        where: { userId }
    });
    if (!provider) {
        throw new Error("Provider profile not found for this user!");
    }
    return provider.id;
};

const createMealIntoDB = async (payload: any, userId: string) => {
    const { name, categoryId } = payload;
    const providerId = await getProviderIdByUserId(userId);

    const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!categoryExists) throw new Error("Invalid Category ID");

    const alreadyExists = await prisma.meal.findFirst({
        where: {
            name: { equals: name, mode: 'insensitive' }, 
            providerId,
        },
    });

    if (alreadyExists) {
        throw new Error("You have already added a meal with this name!");
    }

    return await prisma.meal.create({
        data: { ...payload, providerId },
        include: { category: true }
    });
};

const getAllMealsFromDB = async (query: any) => {
    const { searchTerm, categoryId, minPrice, maxPrice, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const whereCondition: any = {
        AND: [
            searchTerm ? {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } }
                ]
            } : {},
            categoryId ? { categoryId } : {},
            {
                price: {
                    gte: minPrice ? Number(minPrice) : 0,
                    lte: maxPrice ? Number(maxPrice) : 999999,
                },
            },
        ],
    };

    const result = await prisma.meal.findMany({
        where: whereCondition,
        skip,
        take: Number(limit),
        include: { 
            category: true, 
            provider: { 
                select: { 
                    id: true, 
                    restaurantName: true, 
                    user: { select: { name: true, email: true } } 
                } 
            },
          
            reviews: {
                select: { rating: true }
            }
        },
        orderBy: { [sortBy]: sortOrder },
    });

    const total = await prisma.meal.count({ where: whereCondition });

    return {
        meta: { page: Number(page), limit: Number(limit), total, totalPage: Math.ceil(total / Number(limit)) },
        data: result,
    };
};

const updateMealInDB = async (mealId: string, userId: string, payload: any) => {
    const providerId = await getProviderIdByUserId(userId);
    return await prisma.meal.update({
        where: { id: mealId, providerId }, 
        data: payload,
    });
};

const deleteMealFromDB = async (mealId: string, userId: string) => {
    const providerId = await getProviderIdByUserId(userId);
    return await prisma.meal.delete({
        where: { id: mealId, providerId }, 
    });
};

const getSingleMealFromDB = async (id: string) => {
  const result = await prisma.meal.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      provider: {
        select: { 
          restaurantName: true, 
          address: true,
          phone: true 
        } 
      },
      
      reviews: {
        include: {
            customer: {
                select: { name: true, image: true }
            }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  return result;
};

export const MealService = {
    createMealIntoDB,
    getAllMealsFromDB,
    updateMealInDB,
    deleteMealFromDB,
    getSingleMealFromDB
};