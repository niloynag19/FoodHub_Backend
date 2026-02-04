import { prisma } from "../../lib/prisma";


const addToCartIntoDB = async (userId: string, mealId: string, quantity: number, price: number) => {
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, mealId },
  });

  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      mealId,
      quantity,
      price,
    },
  });
};

const getCartFromDB = async (userId: string) => {
  return await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          meal: true,
        },
      },
    },
  });
};

const removeFromCartFromDB = async (itemId: string) => {
  return await prisma.cartItem.delete({
    where: { id: itemId },
  });
};

export const CartService = {
  addToCartIntoDB,
  getCartFromDB,
  removeFromCartFromDB,
};