import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function MaterialDetailPage({ params }: Props) {
  const user = await getUserFromCookie(); // <--- PENTING: await!

  if (!user) {
    redirect('/login'); // atau '/register' sesuai alur kamu
  }

  const material = await prisma.material.findFirst({
    where: { id: Number(params.id), approved: true },
    include: { author: true },
  });

  if (!material) {
    return <p className="text-center text-red-600 mt-10">Materi tidak ditemukan.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{material.title}</h1>
      <p className="text-gray-500 text-sm mb-4">By {material.author.name}</p>
      {material.flyerUrl && (
        <img src={material.flyerUrl} className="mb-4 rounded" alt="Flyer" />
      )}
      <p className="mb-4">{material.description}</p>
      <a href={material.fileUrl} target="_blank" className="text-blue-600 underline">
        Buka File Materi
      </a>
    </div>
  );
}
