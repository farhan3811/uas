import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const userExist = await prisma.user.findUnique({ where: { email } });
  if (userExist) return NextResponse.json({ error: 'Email already used' }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'USER',
    },
  });

  return NextResponse.json({ message: 'Register successful' });
}
