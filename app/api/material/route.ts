import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

interface MyJwtPayload extends JwtPayload {
  id: number;
  role: 'USER' | 'ADMIN';
}

export async function POST(req: Request) {
  try {
const cookieStore = await cookies();
const token = cookieStore.get('token')?.value;


    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verifikasi token dan tangani error expired
    let decoded: MyJwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Ambil form data
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    const flyerFile = formData.get('flyer') as File;
    const materialFile = formData.get('file') as File;

    // Validasi file
    if (!flyerFile || !materialFile) {
      return NextResponse.json({ error: 'Both flyer and material files are required' }, { status: 400 });
    }

    // Simpan flyer
    const flyerBytes = await flyerFile.arrayBuffer();
    const flyerPath = path.join(process.cwd(), 'public/uploads', flyerFile.name);
    await writeFile(flyerPath, Buffer.from(flyerBytes));

    // Simpan materi file
    const fileBytes = await materialFile.arrayBuffer();
    const filePath = path.join(process.cwd(), 'public/uploads', materialFile.name);
    await writeFile(filePath, Buffer.from(fileBytes));

    const fileType = path.extname(materialFile.name).substring(1); // contoh: 'pdf', 'mp4'

    // Simpan ke database
    const newMaterial = await prisma.material.create({
      data: {
        title,
        description,
        flyerUrl: `/uploads/${flyerFile.name}`,
        fileUrl: `/uploads/${materialFile.name}`,
        fileType,
        authorId: decoded.id,
        approved: decoded.role === 'ADMIN', // otomatis approved jika admin
      },
    });

    return NextResponse.json({ message: 'Material uploaded', data: newMaterial });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
