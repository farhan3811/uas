import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromCookie } from '@/lib/auth';

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const user = await getUserFromCookie();

  if (!user || typeof user !== 'object' || !('id' in user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { content, materialId, parentId } = body;

  if (!content || !materialId) {
    return NextResponse.json({ error: 'Missing content or materialId' }, { status: 400 });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        materialId: Number(materialId),
        authorId: Number(user.id),
        parentId: parentId ? Number(parentId) : null,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const materialId = searchParams.get('materialId');

  if (!materialId) {
    return NextResponse.json({ error: 'Missing materialId' }, { status: 400 });
  }

  try {
    const newComment = await prisma.comment.findMany({
      where: {
        materialId: Number(materialId),
        parentId: null,
      },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json({ error: 'Failed to get comments' }, { status: 500 });
  }
}
