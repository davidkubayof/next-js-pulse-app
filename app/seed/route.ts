import { seedDatabase } from '@/lib/dal/seed';

export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  try {
    await seedDatabase();
    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
