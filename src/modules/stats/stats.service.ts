import { prisma } from "../../lib/prisma";

const getAdminStatsFromDB = async () => {
  const totalUsers = await prisma.user.count();
  const totalProviders = await prisma.providerProfile.count();
  const totalMeals = await prisma.meal.count();
  const totalOrders = await prisma.order.count();
  

  const totalRevenue = await prisma.order.aggregate({
    where: { status: "DELIVERED" },
    _sum: { totalAmount: true }
  });

  return {
    totalUsers,
    totalProviders,
    totalMeals,
    totalOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0
  };
};

const getProviderStatsFromDB = async (userId: string) => {

  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });

  if (!provider) throw new Error("Provider not found!");

  const myTotalMeals = await prisma.meal.count({
    where: { providerId: provider.id }
  });

  const myOrders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          meal: { providerId: provider.id }
        }
      }
    }
  });

  const myRevenue = myOrders
    .filter(order => order.status === "DELIVERED")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return {
    myTotalMeals,
    totalOrders: myOrders.length,
    totalRevenue: myRevenue,
    recentOrders: myOrders.slice(0, 5) 
  };
};

export const StatsService = {
  getAdminStatsFromDB,
  getProviderStatsFromDB
};