import { prisma } from "../../lib/prisma";

const getAllUsersFromDB = async (role?: string) => {
  return await prisma.user.findMany({
    where: role ? { role: role as any } : {},
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  });
};

const updateUserRoleInDB = async (userId: string, newRole: any) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });
};


const getAdminDashboardStats = async () => {
  const [totalUsers, totalProviders, totalMeals, totalOrders, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.providerProfile.count(),
    prisma.meal.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { totalAmount: true }
    })
  ]);

  return {
    totalUsers,
    totalProviders,
    totalMeals,
    totalOrders,
    totalRevenue: revenue._sum.totalAmount || 0
  };
};

const deleteAnyMealFromDB = async (mealId: string) => {
  return await prisma.meal.delete({
    where: { id: mealId }
  });
};

export const AdminService = {
  getAllUsersFromDB,
  updateUserRoleInDB,
  getAdminDashboardStats,
  deleteAnyMealFromDB
};