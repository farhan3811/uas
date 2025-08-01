import { prisma } from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const user = getUserFromCookie();
  const materials = await prisma.material.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Materi Edukasi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <div key={m.id} className="border rounded shadow p-4 flex flex-col">
            <img src={m.flyerUrl} alt="Flyer" className="h-40 object-cover w-full mb-2 rounded" />
            <h2 className="text-lg font-semibold mb-1">{m.title}</h2>
            <Link
              href={user ? `/material/${m.id}` : '/register'}
              className="mt-auto bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
            >
              {user ? 'Lihat Materi' : 'Daftar untuk Akses'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
