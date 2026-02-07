import { prisma } from "../../lib/prisma";

const addToCartIntoDB = async (userId: string, mealId: string, quantity: number, price: number) => {
  // ১. সেফটি চেক: userId না থাকলে যেন প্রিজমা ক্রাশ না করে
  if (!userId) {
    throw new Error("User ID is required to perform this action.");
  }

  // ২. কার্ট খুঁজে বের করা বা তৈরি করা
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  // ৩. আইটেম চেক করা
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, mealId },
  });

  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  // ৪. নতুন আইটেম তৈরি
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
  if (!userId) return null; // সেফটি রিটার্ন
  
  return await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          meal: {
            include: {
              category: true, 
            }
          },
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