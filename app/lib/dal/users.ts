import { prisma } from '@/lib/db';
import { delay, DEMO_READ_DELAY_MS } from '@/lib/delay';

export type UserPublic = {
  id: string;
  name: string;
  email: string;
};

/** Credential lookup — no artificial delay (login UX). */
export async function findUserWithPasswordByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function fetchUsers(): Promise<UserPublic[]> {
  await delay(DEMO_READ_DELAY_MS);
  try {
    return await prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, email: true },
    });
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}
