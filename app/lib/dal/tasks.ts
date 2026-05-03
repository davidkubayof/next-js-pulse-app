import { Prisma, type Task } from '@prisma/client';
import { prisma } from '@/lib/db';
import { delay, DEMO_READ_DELAY_MS } from '@/lib/delay';
import { runInTransactionWithAudit } from '@/lib/dal/withAudit';

const ITEMS_PER_PAGE = 6;

export type TaskWithUser = Prisma.TaskGetPayload<{
  include: {
    user: { select: { id: true; name: true; email: true } };
  };
}>;

function taskSearchWhere(query: string) {
  const q = query.trim();
  if (!q) {
    return {};
  }
  return {
    OR: [
      { title: { contains: q, mode: 'insensitive' as const } },
      { description: { contains: q, mode: 'insensitive' as const } },
      { status: { contains: q, mode: 'insensitive' as const } },
      { priority: { contains: q, mode: 'insensitive' as const } },
      {
        user: {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
          ],
        },
      },
    ],
  };
}

export async function fetchCardData() {
  await delay(DEMO_READ_DELAY_MS);
  try {
    const [totalTasksCount, inProgressCount, completedCount] = await Promise.all([
      prisma.task.count({ where: { isDeleted: false } }),
      prisma.task.count({ where: { isDeleted: false, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { isDeleted: false, status: 'DONE' } }),
    ]);
    return { totalTasksCount, inProgressCount, completedCount };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchLatestTasks(): Promise<Task[]> {
  await delay(DEMO_READ_DELAY_MS);
  try {
    return await prisma.task.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tasks.');
  }
}

export async function fetchTasksPages(query: string) {
  await delay(DEMO_READ_DELAY_MS);
  try {
    const search = taskSearchWhere(query);
    const count = await prisma.task.count({
      where: {
        AND: [{ isDeleted: false }, ...(Object.keys(search).length ? [search] : [])],
      },
    });
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of tasks.');
  }
}

export async function fetchFilteredTasks(
  query: string,
  currentPage: number,
): Promise<TaskWithUser[]> {
  await delay(DEMO_READ_DELAY_MS);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const search = taskSearchWhere(query);
  try {
    return await prisma.task.findMany({
      where: {
        AND: [{ isDeleted: false }, ...(Object.keys(search).length ? [search] : [])],
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: ITEMS_PER_PAGE,
      skip,
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tasks.');
  }
}

export async function fetchTaskById(id: string) {
  await delay(DEMO_READ_DELAY_MS);
  try {
    return await prisma.task.findFirst({
      where: { id, isDeleted: false },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch task.');
  }
}

type CreateTaskInput = {
  userId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
};

export async function createTaskRecord(input: CreateTaskInput, actorUserId: string) {
  return runInTransactionWithAudit(async (tx) => {
    const task = await tx.task.create({
      data: {
        userId: input.userId,
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
      },
    });
    return {
      result: task,
      audit: {
        action: 'TASK_CREATED',
        entityId: task.id,
        userId: actorUserId,
        details: `Created task "${task.title}".`,
      },
    };
  });
}

type UpdateTaskInput = {
  title: string;
  description: string | null;
  userId: string;
  status: string;
  priority: string;
};

export async function updateTaskRecord(
  id: string,
  input: UpdateTaskInput,
  actorUserId: string,
) {
  return runInTransactionWithAudit(async (tx) => {
    const existing = await tx.task.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) {
      throw new Error('Task not found.');
    }
    const task = await tx.task.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        userId: input.userId,
        status: input.status,
        priority: input.priority,
      },
    });
    return {
      result: task,
      audit: {
        action: 'TASK_UPDATED',
        entityId: id,
        userId: actorUserId,
        details: JSON.stringify({
          title: task.title,
          status: task.status,
          priority: task.priority,
        }),
      },
    };
  });
}

export async function updateTaskStatusRecord(
  id: string,
  status: string,
  actorUserId: string,
) {
  return runInTransactionWithAudit(async (tx) => {
    const existing = await tx.task.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) {
      throw new Error('Task not found.');
    }
    const task = await tx.task.update({
      where: { id },
      data: { status },
    });
    return {
      result: task,
      audit: {
        action: 'TASK_STATUS_UPDATED',
        entityId: id,
        userId: actorUserId,
        details: JSON.stringify({ status }),
      },
    };
  });
}

export async function softDeleteTaskRecord(id: string, actorUserId: string) {
  return runInTransactionWithAudit(async (tx) => {
    const existing = await tx.task.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) {
      throw new Error('Task not found.');
    }
    const deletedTask = await tx.task.update({
      where: { id },
      data: { isDeleted: true },
    });
    return {
      result: deletedTask,
      audit: {
        action: 'DELETE_TASK',
        entityId: id,
        userId: actorUserId,
        details: `Task titled "${deletedTask.title}" was moved to archive.`,
      },
    };
  });
}
