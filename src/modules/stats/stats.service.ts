import { prisma } from "../../lib/prisma";

const getAdminStatsFromDB = async () => {
  const [
    totalUsers,
    totalProviders,
    totalMeals,
    totalOrders,
    revenueData,
    ordersByStatus,
    categoryStats,
    monthlyRevenue
  ] = await Promise.all([
    prisma.user.count(),
    prisma.providerProfile.count(),
    prisma.meal.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: "DELIVERED" },
      _sum: { totalAmount: true }
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    }),
    prisma.category.findMany({
      select: {
        name: true,
        _count: { select: { meals: true } }
      }
    }),
    prisma.order.findMany({
      where: { status: "DELIVERED" },
      select: { totalAmount: true, createdAt: true },
      take: 100,
      orderBy: { createdAt: 'asc' }
    })
  ]);

  return {
    summary: {
      totalUsers,
      totalProviders,
      totalMeals,
      totalOrders,
      totalRevenue: revenueData._sum.totalAmount || 0
    },
    ordersByStatus: ordersByStatus.map(item => ({
      status: item.status,
      count: item._count.id
    })),
    categoryStats: categoryStats.map(item => ({
      name: item.name,
      meals: item._count.meals
    })),
    monthlyRevenue: monthlyRevenue.reduce((acc: any[], order) => {
      const month = order.createdAt.toLocaleString('default', { month: 'short' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.revenue += order.totalAmount;
      } else {
        acc.push({ month, revenue: order.totalAmount });
      }
      return acc;
    }, []),
    weeklyOrders: await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      },
      select: { createdAt: true }
    }).then(orders => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const counts: Record<string, number> = {};
      days.forEach(day => counts[day] = 0);
      
      orders.forEach(order => {
        const day = days[order.createdAt.getDay()];
        counts[day]++;
      });
      
      return days.map(day => ({ day, orders: counts[day] }));
    })
  };
};


const getProviderStatsFromDB = async (userId: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });

  if (!provider) throw new Error("Provider not found!");

  const [
    myTotalMeals,
    myOrders,
    revenueData,
    myOrdersByStatus
  ] = await Promise.all([
    prisma.meal.count({ where: { providerId: provider.id } }),
    prisma.order.findMany({
      where: { providerId: provider.id },
      include: { items: { include: { meal: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.order.aggregate({
      where: { providerId: provider.id, status: "DELIVERED" },
      _sum: { totalAmount: true }
    }),
    prisma.order.groupBy({
      where: { providerId: provider.id },
      by: ['status'],
      _count: { id: true }
    })
  ]);

  return {
    summary: {
      totalMeals: myTotalMeals,
      totalOrders: myOrders.length,
      totalRevenue: revenueData._sum.totalAmount || 0
    },
    recentOrders: myOrders,
    ordersByStatus: myOrdersByStatus.map(item => ({
      status: item.status,
      count: item._count.id
    }))
  };
};


export const StatsService = {
  getAdminStatsFromDB,
  getProviderStatsFromDB
};