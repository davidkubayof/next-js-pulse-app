import { prisma } from "@/lib/db";

export async function fetchLatestAuditLogs() {
  return await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } }
  });
}
/**
 * מחזירה את כמות הפעולות (Audit Logs) שבוצעו מהיום בחצות
 */
export async function fetchDailyLogsCount() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const count = await prisma.auditLog.count({
      where: {
        createdAt: {
          gte: startOfDay, // גדול או שווה לתחילת היום
        },
      },
    });

    return count;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch daily logs count.');
  }
}

export async function fetchAuditLogs() {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // הכי חדש למעלה
      },
    });
    return logs;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch audit logs.');
  }
}