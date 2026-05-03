import { prisma } from "@/lib/db";

export async function fetchUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}