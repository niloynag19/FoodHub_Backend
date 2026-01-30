import { prisma, UserRole, UserStatus } from "../../lib/prisma";

const createUserService = async (payload: any) => {
  const { name, email, password, role, phone } = payload;

  return await prisma.user.create({
    data: {
      name,
      email,
      password, 
      role: (role as UserRole) || "CUSTOMER",
      phone: phone || null,
    },
  });
};

const loginUserService = async (payload: any) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found!");
  if (user.status === UserStatus.SUSPENDED) throw new Error("Account Suspended!");

  return user;
};

const getAllUsersService = async () => {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
  });
};

const getMyProfile = async (identifier: string) => {
  return await prisma.user.findFirst({
    where: {
      OR: [
        { id: identifier },    
        { email: identifier }
      ]
    },
    select: { 
      id: true, 
      name: true, 
      email: true, 
      role: true, 
      status: true, 
      phone: true 
    }
  });
};

const updateUserStatusInDB = async (id: string, status: UserStatus) => {
  return await prisma.user.update({
    where: { id },
    data: { status }
  });
};

export const UserService = {
  createUserService,
  loginUserService,
  getAllUsersService,
  getMyProfile,
  updateUserStatusInDB
};