'use client';

import { useState, useEffect } from 'react';

function CommentSection({ materialId }: { materialId: number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?materialId=${materialId}`);
    const data = await res.json();
    setComments(data);
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ content: newComment, materialId }),
      headers: { 'Content-Type': 'application/json' },
    });

    setNewComment('');
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-2">Komentar</h3>

      <textarea
        className="w-full p-2 border rounded mb-2"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Tulis komentar..."
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Kirim
      </button>

      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4 border-t pt-2">
            <p className="text-sm font-semibold">{comment.author.name}</p>
            <p>{comment.content}</p>
            {comment.replies.map((reply: any) => (
              <div key={reply.id} className="ml-4 mt-2 border-l pl-4 text-sm">
                <p className="font-semibold">{reply.author.name}</p>
                <p>{reply.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;

