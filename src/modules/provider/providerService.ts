import { prisma } from "../../lib/prisma";

const getAllProvidersFromDB = async () => {
  return await prisma.providerProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

const getProviderWithMenuFromDB = async (id: string) => {
  return await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true, phone: true },
      },
      meals: {
        where: { isAvailable: true }, 
        include: { category: true }
      },
    },
  });
};

export const ProviderService = {
  getAllProvidersFromDB,
  getProviderWithMenuFromDB,
};