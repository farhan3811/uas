import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function MaterialList() {
  const materials = await prisma.material.findMany({
    where: { approved: true },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Daftar Materi</h1>
      {materials.length === 0 && <p>Tidak ada materi.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials.map((m) => (
          <div key={m.id} className="border p-4 rounded shadow">
            <img src={m.flyerUrl} className="w-full h-40 object-cover mb-2" />
            <h2 className="text-xl font-semibold">{m.title}</h2>
            <p className="text-sm text-gray-700 mb-1">{m.description}</p>
            <p className="text-xs text-gray-500">By {m.author.name}</p>
            <a href={m.fileUrl} target="_blank" className="text-blue-600 text-sm underline">Lihat File</a>
          </div>
        ))}
      </div>
    </div>
  );
}
