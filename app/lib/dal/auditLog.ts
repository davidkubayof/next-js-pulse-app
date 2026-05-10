import * as PrismaClient from '@prisma/client';
import { prisma } from '@/lib/db';
import { delay, DEMO_READ_DELAY_MS } from '@/lib/delay';

export type AuditLogWithUser = PrismaClient.Prisma.AuditLogGetPayload<{
  include: {
    user: { select: { name: true } };
  };
}>;

export async function fetchLatestAuditLogs(userId?: string): Promise<AuditLogWithUser[]> {
  await delay(DEMO_READ_DELAY_MS);
  try {
    return await prisma.auditLog.findMany({
      take: 5,
      where: userId ? { userId } : {},
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

export interface AuditLogFilters {
  user?: string;
  action?: string;
  details?: string;
}

export async function fetchAuditLogs(filters: AuditLogFilters = {}): Promise<AuditLogWithUser[]> {
  await delay(DEMO_READ_DELAY_MS);

  const { user, action, details } = filters;

  try {
    return await prisma.auditLog.findMany({
      where: {
        AND: [
          user ? { user: { name: { contains: user, mode: 'insensitive' } } } : {},
          action ? { action: { contains: action, mode: 'insensitive' } } : {},
          details ? { details: { contains: details, mode: 'insensitive' } } : {},
        ]
      },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('[DATABASE_ERROR] fetchAuditLogs:', error);
    throw new Error('Failed to fetch audit logs.');
  }
}