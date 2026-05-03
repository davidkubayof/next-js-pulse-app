import { prisma } from '@/lib/db';



export async function GET() {
  try {
    const [users, tasks, logs] = await Promise.all([
      prisma.user.findMany(),
      prisma.task.findMany(),
      prisma.auditLog.findMany(),
    ]);

    return Response.json({ users, tasks, logs });
  } catch (error) {
    return Response.json({ error: "Data fetch failed" }, { status: 500 });
  }
}