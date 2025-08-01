'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p className="text-red-600">Unauthorized</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold">Vista App</h1>
        <div className="flex gap-4">
          {user.role === 'ADMIN' && (
            <button
              onClick={() => (window.location.href = '/admin/dashboard')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Materi
            </button>
          )}
                    <button
              onClick={() => (window.location.href = '/material/create')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-red-600"
          >
            Tambah Materi
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p>Welcome, {user.email}</p>
        <p>Your role: <strong>{user.role}</strong></p>
      </div>
    </div>
  );
}
