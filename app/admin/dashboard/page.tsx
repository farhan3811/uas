
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { ApproveButton, RejectButton } from '@/components/ApproveButton';


export default async function AdminDashboard() {
  const materials = await prisma.material.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
            {/* Navbar */}
      <nav className="flex justify-between items-center bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold">Vista App</h1>
        <div className="flex gap-4">
<Link href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Dashboard
</Link>

<Link href="/material/create" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-red-600">
  Tambah Materi
</Link>

        </div>
      </nav>
      <table className="table-auto w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">No</th>
            <th className="border px-2 py-1">Judul</th>
            <th className="border px-2 py-1">Author</th>
            <th className="border px-2 py-1">Tanggal</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m, i) => (
            <tr key={m.id}>
              <td className="border px-2 py-1 text-center">{i + 1}</td>
              <td className="border px-2 py-1">{m.title}</td>
              <td className="border px-2 py-1">{m.author.name}</td>
              <td className="border px-2 py-1">{new Date(m.createdAt).toLocaleDateString()}</td>
              <td className="border px-2 py-1 text-center">
                {m.approved ? (
                  <span className="text-green-600 font-semibold">Disetujui</span>
                ) : (
                  <span className="text-yellow-600 font-semibold">Menunggu</span>
                )}
              </td>
<td className="border px-2 py-1 space-x-2 text-center">
  {!m.approved ? (
    <>
<ApproveButton id={m.id.toString()} />
<RejectButton id={m.id.toString()} />

    </>
  ) : (
    <Link href={m.fileUrl} target="_blank" className="text-blue-600 underline text-sm">
      Lihat File
    </Link>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
