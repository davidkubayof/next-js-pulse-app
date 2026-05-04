import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';
import { users, tasks, logs } from '@/lib/placeholder-data';

async function seedUsers(): Promise<void> {
  const hashedPassword = await bcrypt.hash('123456', 10);
  await Promise.all(
    users.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
      }),
    ),
  );
}

async function seedTasks(): Promise<void> {
  await Promise.all(
    tasks.map((task) =>
      prisma.task.upsert({
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
      }),
    ),
  );
}

async function seedAuditLogs(): Promise<void> {
  await Promise.all(
    logs.map((log) =>
      prisma.auditLog.upsert({
        where: { id: log.id },
        update: {},
        create: {
          id: log.id,
          action: log.action,
          details: log.details,
          entityId: log.entityId,
          userId: log.userId,
        },
      }),
    ),
  );
}

export async function seedDatabase(): Promise<void> {
  await seedUsers();
  await seedTasks();
  await seedAuditLogs();
}
