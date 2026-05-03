import { prisma } from "./src/lib/prisma";

async function check() {
  const count = await prisma.meal.count();
  console.log(`Meal count: ${count}`);
  const meals = await prisma.meal.findMany({ take: 5 });
  console.log("Sample meals:", JSON.stringify(meals, null, 2));
  process.exit(0);
}

check();
