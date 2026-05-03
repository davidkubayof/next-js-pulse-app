import { prisma } from '@/lib/db';

export async function fetchDeletedTasks() {
  try {
    const deletedTasks = await prisma.task.findMany({
      where: {
        isDeleted: true, // זה הסינון המרכזי שביקשת
      },
      include: {
        user: {
          select: {
            name: true, // מביא גם את שם המשתמש שיצר את המשימה, שיהיה נוח לתצוגה
          },
        },
      },
      orderBy: {
        updatedAt: 'desc', // מציג את אלו שנמחקו לאחרונה ראשונים
      },
    });

    return deletedTasks;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch archived tasks.');
  }
}
export async function restoreTask(id: string) {
  try {
    const restoredTask = await prisma.task.update({
      where: { id },
      data: {
        isDeleted: false,
      },
    });
    return restoredTask;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to restore task.');
  }
}