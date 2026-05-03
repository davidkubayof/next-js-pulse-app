import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { delay, DEMO_READ_DELAY_MS } from '@/lib/delay';

export type AuditLogWithUser = Prisma.AuditLogGetPayload<{
  include: {
    user: { select: { name: true } };
  };
}>;

export async function fetchLatestAuditLogs(): Promise<AuditLogWithUser[]> {
  await delay(DEMO_READ_DELAY_MS);
  try {
    return await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch latest audit logs.');
  }
}

export async function fetchDailyLogsCount(): Promise<number> {
  await delay(DEMO_READ_DELAY_MS);
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return await prisma.auditLog.count({
      where: {
        createdAt: { gte: startOfDay },
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch daily logs count.');
  }
}

export async function fetchAuditLogs(): Promise<AuditLogWithUser[]> {
  await delay(DEMO_READ_DELAY_MS);
  try {
    return await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch audit logs.');
  }
}
