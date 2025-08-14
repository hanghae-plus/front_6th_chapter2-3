import { useCallback, useEffect, useMemo, useState } from 'react';
import { postApi, type Post } from '@/entities/post';

export type UsePostsOptions = {
  limit: number;
  skip: number;
  searchQuery?: string;
  tag?: string;
  sortBy?: 'none' | 'id' | 'title' | 'reactions';
  sortOrder?: 'asc' | 'desc';
};

export type UsePostsResult = {
  posts: Post[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

function sortPosts(
  posts: Post[],
  sortBy: UsePostsOptions['sortBy'],
  sortOrder: UsePostsOptions['sortOrder'],
): Post[] {
  if (!sortBy || sortBy === 'none') return posts;

  const sorted = [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'id':
        return (a.id ?? 0) - (b.id ?? 0);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'reactions': {
        const aScore = (a.reactions?.likes ?? 0) - (a.reactions?.dislikes ?? 0);
        const bScore = (b.reactions?.likes ?? 0) - (b.reactions?.dislikes ?? 0);
        return aScore - bScore;
      }
      default:
        return 0;
    }
  });

  if (sortOrder === 'desc') {
    sorted.reverse();
  }
  return sorted;
}

export function usePosts(options: UsePostsOptions): UsePostsResult {
  const { limit, skip, searchQuery, tag, sortBy = 'none', sortOrder = 'asc' } = options;
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetcher = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (searchQuery && searchQuery.trim().length > 0) {
        const data = await postApi.searchPosts(searchQuery);
        setPosts(data.posts);
        setTotal(data.total ?? data.posts.length);
        return;
      }
      if (tag && tag !== 'all') {
        const data = await postApi.getPostsByTag(tag);
        setPosts(data.posts);
        setTotal(data.total ?? data.posts.length);
        return;
      }
      const data = await postApi.getPosts({ limit, skip });
      setPosts(data.posts);
      setTotal(data.total ?? data.posts.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [limit, skip, searchQuery, tag]);

  useEffect(() => {
    void fetcher();
  }, [fetcher]);

  const sortedPosts = useMemo(
    () => sortPosts(posts, sortBy, sortOrder),
    [posts, sortBy, sortOrder],
  );

  return {
    posts: sortedPosts,
    total,
    loading,
    error,
    refetch: fetcher,
  };
}
