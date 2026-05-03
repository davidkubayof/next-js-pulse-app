import { prisma } from '@/lib/db';
import { delay, DEMO_READ_DELAY_MS } from '@/lib/delay';
import { runInTransactionWithAudit } from '@/lib/dal/withAudit';

export async function fetchDeletedTasks() {
  await delay(DEMO_READ_DELAY_MS);
  try {
    return await prisma.task.findMany({
      where: { isDeleted: true },
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch archived tasks.');
  }
}

export async function restoreDeletedTask(taskId: string, actorUserId: string) {
  return runInTransactionWithAudit(async (tx) => {
    const existing = await tx.task.findFirst({
      where: { id: taskId, isDeleted: true },
    });
    if (!existing) {
      throw new Error('Archived task not found.');
    }
    const restored = await tx.task.update({
      where: { id: taskId },
      data: { isDeleted: false },
    });
    return {
      result: restored,
      audit: {
        action: 'TASK_RESTORED',
        entityId: taskId,
        userId: actorUserId,
        details: `Restored task "${restored.title}".`,
      },
    };
  });
}
