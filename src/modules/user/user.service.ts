import { prisma } from "../../lib/prisma";


export const createUserService = async (data: { name: string; email: string; password: string }) => {
  const { name, email, password } = data;

  // const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password
    },
  });

  return newUser;
};

export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, createdAt: true }, // password hide
  });

  return users;
};
