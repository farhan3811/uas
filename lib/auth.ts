import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getUserFromCookie() {
  const cookieStore = await cookies(); // <--- TAMBAHKAN AWAIT
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

