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
    const providerId = await getProviderIdByUserId(userId);

    return await prisma.meal.create({
        data: {
            ...payload,
            providerId, 
        },
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

export const MealService = {
    createMealIntoDB,
    getAllMealsFromDB,
    updateMealInDB,
    deleteMealFromDB,
};