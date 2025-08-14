import { useCallback, useEffect, useState } from 'react';
import { commentApi, type Comment } from '@/entities/comment';

export type UseCommentsResult = {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  add: (payload: Omit<Comment, 'id'>) => Promise<void>;
  update: (id: number, patch: Partial<Comment>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  like: (id: number) => Promise<void>;
};

export function useComments(postId: number | null): UseCommentsResult {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetcher = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await commentApi.getCommentsByPost(postId);
      setComments(data.comments);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void fetcher();
  }, [fetcher]);

  const add = useCallback(async (payload: Omit<Comment, 'id'>) => {
    const created = await commentApi.addComment(payload);
    setComments((prev) => [...prev, created]);
  }, []);

  const update = useCallback(async (id: number, patch: Partial<Comment>) => {
    const updated = await commentApi.updateComment(id, patch);
    setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const remove = useCallback(async (id: number) => {
    await commentApi.deleteComment(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const like = useCallback(
    async (id: number) => {
      const current = comments.find((c) => c.id === id);
      const currentLikes = current?.likes ?? 0;
      const updated = await commentApi.likeComment(id, currentLikes);
      setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    },
    [comments],
  );

  return { comments, loading, error, refetch: fetcher, add, update, remove, like } as const;
}
