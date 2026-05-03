import { prisma } from "@/lib/db";

export async function fetchCardData() {
  try {
    // מריצים את כל השאילתות במקביל כדי לחסוך זמן
    const [totalTasksCount, inProgressCount, completedCount] = await Promise.all([
      prisma.task.count({ where: { isDeleted: false } }),
      prisma.task.count({ where: { isDeleted: false, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { isDeleted: false, status: 'COMPLETED' } }),
    ]);

    // מחזירים אובייקט מסודר עם שמות ברורים
    return {
      totalTasksCount,
      inProgressCount,
      completedCount,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
// הפונקציה החדשה להבאת כל המשימות הפעילות
export async function fetchLatestTasks() {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc', // מציג קודם את המשימות האחרונות שנוצרו
      },
    });

    return tasks;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tasks.');
  }
}
const ITEMS_PER_PAGE = 6;
export async function fetchTasksPages(query: string) {
  try {
    const count = await prisma.task.count({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { status: { contains: query, mode: 'insensitive' } },
          { priority: { contains: query, mode: 'insensitive' } },
          {
            user: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
              ],
            },
          },
        ],
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
) {
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        // שילוב של תנאי המחיקה עם תנאי החיפוש
        AND: [
          { isDeleted: false }, // תנאי ראשון: רק משימות שלא נמחקו
          {
            OR: [ // תנאי שני: חיפוש לפי הטקסט
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { status: { contains: query, mode: 'insensitive' } },
              { priority: { contains: query, mode: 'insensitive' } },
              {
                user: {
                  OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                  ],
                },
              },
            ],
          },
        ],
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: ITEMS_PER_PAGE,
      skip: skip,
    });

    return tasks;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tasks.');
  }
}
export async function fetchTaskById(id: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return null;
    }

    // אין צורך בחישובים (כמו חילוק ב-100) אלא אם הוספת שדה מחיר לסכימה
    return task;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch task.');
  }
}