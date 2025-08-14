import type { User } from '@/entities/user/model';

export async function getUserById(userId: number): Promise<User> {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}
