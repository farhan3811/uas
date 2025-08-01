import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromCookie();

  if (
    !user ||
    typeof user !== 'object' ||
    Array.isArray(user) ||
    !('role' in user) ||
    (user as any).role !== 'ADMIN'
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updated = await prisma.material.update({
    where: { id: Number(params.id) },
    data: { approved: true },
  });

  return NextResponse.json({ message: 'Approved', updated });
}
