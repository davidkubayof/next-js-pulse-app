import { fetchQuerySnapshot } from '@/lib/dal/query';

export async function GET() {
  try {
    const payload = await fetchQuerySnapshot();
    return Response.json(payload);
  } catch {
    return Response.json({ error: 'Data fetch failed' }, { status: 500 });
  }
}
