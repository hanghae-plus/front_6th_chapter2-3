import { useCallback, useState } from 'react';
import type { Post } from '@/entities/post';

export function usePostDetail() {
  const [open, setOpen] = useState<boolean>(false);
  const [post, setPost] = useState<Post | null>(null);

  const show = useCallback((p: Post) => {
    setPost(p);
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  return { open, post, show, hide } as const;
}
