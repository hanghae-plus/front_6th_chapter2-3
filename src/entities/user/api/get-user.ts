import { client } from '@/shared/configs';
import type { User } from '@/entities/user/model';

export async function getUserById(userId: number): Promise<User> {
  return client.get<User>(`/users/${userId}`);
}
