import { PrismaClient, Prisma } from "@/libs/prisma/prismaClient";

const prisma = new PrismaClient()

export const user = async () => {
  console.log('user')

  const now = new Date()
  const SEED_DATA: Prisma.UserCreateInput[] = [
    {
      createdAt: now,
      name: 'Admin',
    },
    {
      createdAt: now,
      name: 'User1',
    },
    {
      createdAt: now,
      name: 'User2',
    },
  ]

  await prisma.user.deleteMany()
  await prisma.user.createMany({
    data: SEED_DATA,
  })
}
