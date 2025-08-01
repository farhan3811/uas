'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function ApproveButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleApprove = async () => {
    await fetch(`/api/material/approve/${id}`, {
      method: 'POST',
    });
    startTransition(() => {
      router.refresh(); // refresh data di halaman
    });
  };

  return (
    <button
      onClick={handleApprove}
      disabled={isPending}
      className="bg-green-600 text-white px-2 py-1 text-xs rounded hover:bg-green-700"
    >
      {isPending ? 'Memproses...' : 'Approve'}
    </button>
  );
}

export function RejectButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleReject = async () => {
    await fetch(`/api/material/reject/${id}`, {
      method: 'POST',
    });
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleReject}
      disabled={isPending}
      className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
    >
      {isPending ? 'Memproses...' : 'Reject'}
    </button>
  );
}
