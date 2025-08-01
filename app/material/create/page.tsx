'use client';
import { useState } from 'react';

export default function CreateMaterial() {
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const token = localStorage.getItem('token');

    const res = await fetch('/api/material', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setMsg(data.message || data.error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">📚 Buat Materi Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Materi</label>
            <input
              name="title"
              placeholder="Contoh: Belajar React Dasar"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              name="description"
              placeholder="Tuliskan deskripsi singkat materi..."
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Flyer (gambar)</label>
            <input
              type="file"
              name="flyer"
              accept="image/*"
              required
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Materi (pdf, ppt, mp4, dll)</label>
            <input
              type="file"
              name="file"
              accept=".pdf,.ppt,.mp4,.mp3,.wav,.avi"
              required
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Simpan Materi
          </button>

          {msg && (
            <p className="text-sm mt-2 text-center text-red-600 font-medium">{msg}</p>
          )}
        </form>
      </div>
    </div>
  );
}
