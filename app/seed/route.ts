import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';
import { users, tasks, logs } from '@/lib/placeholder-data';
export const runtime = 'nodejs';

async function seedUsers() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  return await Promise.all(
    users.map(async (user) => {
      return prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
      });
    }),
  );
}

async function seedTasks() {
  return await Promise.all(
    tasks.map(async (task) => {
      return prisma.task.upsert({
        where: { id: task.id },
        update: {},
        create: {
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          userId: task.userId,
        },
      });
    }),
  );
}

async function seedAuditLogs() {
  return await Promise.all(
    logs.map(async (log) => {
      return prisma.auditLog.upsert({
        where: { id: log.id },
        update: {},
        create: {
          id: log.id,
          action: log.action,
          details: log.details,
          entityId: log.entityId,
          userId: log.userId,
        },
      });
    }),
  );
}

export async function GET() {
  try {
    // הרצת הפונקציות אחת אחרי השניה (בדיוק כמו ב-SQL המקורי)
    await seedUsers();
    await seedTasks();
    await seedAuditLogs();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}