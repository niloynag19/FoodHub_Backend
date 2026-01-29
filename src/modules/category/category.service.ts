import { prisma } from "../../lib/prisma";

const createCategoryIntoDB = async (payload: { name: string; image?: string }) => {
    return await prisma.category.create({
        data: payload,
    });
};

const getAllCategoriesFromDB = async (query: any) => {
    const { searchTerm, page = 1, limit = 10 } = query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereCondition = searchTerm
        ? {
              name: {
                  contains: searchTerm as string,
                  mode: "insensitive" as const,
              },
          }
        : {};

    const result = await prisma.category.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: {
            name: "asc", 
        },
    });

    const total = await prisma.category.count({ where: whereCondition });

    return {
        meta: {
            page: Number(page),
            limit: take,
            total,
            totalPage: Math.ceil(total / take),
        },
        data: result,
    };
};

const updateCategoryInDB = async (id: string, payload: Partial<{ name: string; image: string }>) => {
    return await prisma.category.update({
        where: { id },
        data: payload,
    });
};

const deleteCategoryFromDB = async (id: string) => {
    return await prisma.category.delete({
        where: { id },
    });
};

export const CategoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    updateCategoryInDB,
    deleteCategoryFromDB,
};