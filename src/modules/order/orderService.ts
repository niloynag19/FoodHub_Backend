import { prisma, Prisma, OrderStatus, UserRole } from "../../lib/prisma";

const createOrderIntoDB = async (userId: string, payload: any) => {
    const { items, deliveryAddress, providerId } = payload;

    if (!items || items.length === 0) throw new Error("Order items cannot be empty");

    return await prisma.$transaction(async (tx) => {
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const meal = await tx.meal.findUnique({ where: { id: item.mealId } });
            if (!meal) throw new Error(`Meal not found: ${item.mealId}`);

            totalAmount += meal.price * item.quantity;
            orderItemsData.push({
                mealId: meal.id,
                quantity: item.quantity,
                price: meal.price,
            });
        }

        return await tx.order.create({
            data: {
                customerId: userId,
                providerId,
                deliveryAddress,
                totalAmount,
                status: OrderStatus.PLACED,
                items: { create: orderItemsData },
            },
            include: { items: true },
        });
    });
};

const getAllOrdersFromDB = async (
    query: any,
    role: UserRole, 
    userId: string
) => {
    const {
        status,
        searchTerm,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereConditions: Prisma.OrderWhereInput = {};

    if (role === UserRole.PROVIDER) {
        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId },
        });
        if (!providerProfile) throw new Error("Provider profile not found");
        whereConditions.providerId = providerProfile.id;
    }

    else if (role === UserRole.CUSTOMER) {
        whereConditions.customerId = userId;
    }


    if (status) {
        whereConditions.status = status as OrderStatus;
    }

    if (searchTerm) {
        whereConditions.OR = [
            { deliveryAddress: { contains: searchTerm, mode: "insensitive" } },
            { id: { contains: searchTerm, mode: "insensitive" } },
        ];
    }

    const orders = await prisma.order.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder } as Prisma.OrderOrderByWithRelationInput,
        include: {
            customer: { select: { name: true, email: true, phone: true } },
            provider: { select: { restaurantName: true, phone: true } },
            items: { include: { meal: true } },
        },
    });

    const total = await prisma.order.count({ where: whereConditions });

    return {
        meta: { page: Number(page), limit: take, total, totalPage: Math.ceil(total / take) },
        data: orders,
    };
};

const getMyOrdersFromDB = async (userId: string, query: any) => {
    return await getAllOrdersFromDB(query, UserRole.CUSTOMER, userId);
};

export const OrderService = {
    createOrderIntoDB,
    getAllOrdersFromDB,
    getMyOrdersFromDB,
};