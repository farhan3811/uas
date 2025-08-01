import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = getUserFromCookie();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.material.delete({ where: { id: Number(params.id) } });

  return NextResponse.json({ message: 'Deleted' });
}
