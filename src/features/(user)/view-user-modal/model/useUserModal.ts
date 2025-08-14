import { useCallback, useState } from 'react';
import { userApi, type User } from '@/entities/user';

export function useUserModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const show = useCallback(async (userId: number) => {
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getUserById(userId);
      setUser(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  return { open, user, loading, error, show, hide } as const;
}
