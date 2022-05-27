const { PrismaClient } = require('@prisma/client');
const users = require('../mocks/mockUsers.json');
const listings = require('../mocks/mockListings.json');

const prisma = new PrismaClient();

async function main (): Promise<void> {
  for (const user of users) {
    await prisma.user.create({ data: user });
  };

  for (const listing of listings) {
    await prisma.listing.create({ data: listing });
  };
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
