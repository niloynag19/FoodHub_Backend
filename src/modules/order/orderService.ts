import { prisma, Prisma, OrderStatus, UserRole } from "../../lib/prisma";

const createOrderIntoDB = async (userId: string, payload: any) => {
    const { items, deliveryAddress } = payload; 

    if (!items || items.length === 0) throw new Error("Order items cannot be empty");
    if (!deliveryAddress || deliveryAddress.trim() === "") {
        throw new Error("Delivery address is required");
    }

    // --- এই অংশটুকু যোগ করুন ---
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { status: true }
    });

    if (user?.status === "SUSPENDED") {
        throw new Error("Your account is suspended! You cannot place any new orders.");
    }
    // -----------------------

    return await prisma.$transaction(async (tx) => {
        let totalAmount = 0;
        const orderItemsData = [];
        let finalProviderProfileId = "";

        for (const item of items) {
            const meal = await tx.meal.findUnique({ 
                where: { id: item.mealId } 
            });
            
            if (!meal) throw new Error(`Meal not found: ${item.mealId}`);

            if (!finalProviderProfileId) {
                finalProviderProfileId = meal.providerId; 
            }

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
                providerId: finalProviderProfileId,
                deliveryAddress,
                totalAmount,
                status: "PLACED",
                items: { create: orderItemsData },
            },
            include: { items: true },
        });
    });
};

const getAllOrdersFromDB = async (query: any, role: UserRole, userId: string) => {
    const { status, searchTerm, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereConditions: Prisma.OrderWhereInput = {};

    if (role === UserRole.PROVIDER) {
        const providerProfile = await prisma.providerProfile.findUnique({ where: { userId } });
        if (!providerProfile) throw new Error("Provider profile not found");
        whereConditions.providerId = providerProfile.id;
    } else if (role === UserRole.CUSTOMER) {
        whereConditions.customerId = userId;
    }

    if (status) whereConditions.status = status as OrderStatus;

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

const getOrderByIdFromDB = async (orderId: string, userId: string, role: UserRole) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { meal: true } }, customer: true, provider: true }
    });

    if (!order) throw new Error("Order not found");

    if (role === UserRole.CUSTOMER && order.customerId !== userId) throw new Error("Unauthorized");
    return order;
};

const updateOrderStatusByProvider = async (orderId: string, userId: string, status: OrderStatus) => {
    const provider = await prisma.providerProfile.findUnique({ where: { userId } });
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order || order.providerId !== provider?.id) {
        throw new Error("You are not authorized to update this order");
    }

    return await prisma.order.update({
        where: { id: orderId },
        data: { status }
    });
};

const getMyOrdersFromDB = async (userId: string, query: any) => {
    return await getAllOrdersFromDB(query, UserRole.CUSTOMER, userId);
};

export const OrderService = {
    createOrderIntoDB,
    getAllOrdersFromDB,
    getMyOrdersFromDB,
    getOrderByIdFromDB,
    updateOrderStatusByProvider
};