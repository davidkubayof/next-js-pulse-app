import { prisma } from '@/lib/db';
import { delay, DEMO_READ_DELAY_MS } from '@/lib/delay';

/** Safe snapshot for diagnostics — never exposes password hashes. */
export async function fetchQuerySnapshot() {
  await delay(DEMO_READ_DELAY_MS);
  const [users, tasks, logs] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { email: 'asc' },
    }),
    prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);
  return { users, tasks, logs };
}
