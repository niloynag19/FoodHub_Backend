import "dotenv/config";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
// রুটে থাকা জেনারেটেড ফোল্ডারে যাওয়ার জন্য দুই ধাপ পেছনে (../../) যেতে হবে
import { PrismaClient, Prisma } from '../../generated/prisma/client'; 

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

// এখান থেকে সব টাইপ এক্সপোর্ট হবে (OrderStatus, UserRole ইত্যাদি)
export * from '../../generated/prisma/client'; 
export { Prisma };