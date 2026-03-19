import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Electronics', minAmount: 50, maxAmount: 2000 },
  { name: 'Clothing', minAmount: 20, maxAmount: 500 },
  { name: 'Food & Beverages', minAmount: 5, maxAmount: 80 },
  { name: 'Home & Garden', minAmount: 30, maxAmount: 800 },
  { name: 'Sports', minAmount: 15, maxAmount: 600 },
  { name: 'Books', minAmount: 10, maxAmount: 120 },
];

const DAYS_IN_YEAR = 365;
const BASE_DATE = new Date('2025-01-01');

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

async function main(): Promise<void> {
  console.log('Seeding database...');

  await prisma.transaction.deleteMany();

  const transactions: Array<{
    amount: number;
    quantity: number;
    category: string;
    createdAt: Date;
  }> = [];

  for (let day = 0; day < DAYS_IN_YEAR; day++) {
    const transactionsPerDay = randomInt(3, 8);

    for (let i = 0; i < transactionsPerDay; i++) {
      const category = CATEGORIES[randomInt(0, CATEGORIES.length - 1)];
      const date = new Date(BASE_DATE);
      date.setDate(date.getDate() + day);
      date.setHours(randomInt(8, 22), randomInt(0, 59), randomInt(0, 59));

      transactions.push({
        amount: Number(randomBetween(category.minAmount, category.maxAmount).toFixed(2)),
        quantity: randomInt(1, 10),
        category: category.name,
        createdAt: date,
      });
    }
  }

  await prisma.transaction.createMany({ data: transactions });

  console.log(`Seeded ${transactions.length} transactions across ${CATEGORIES.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
