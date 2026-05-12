import "dotenv/config";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client'; 

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const userCount = await prisma.user.count();
  const mealCount = await prisma.meal.count();
  const orderCount = await prisma.order.count();
  const categoryCount = await prisma.category.count();

  console.log({
    userCount,
    mealCount,
    orderCount,
    categoryCount,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
