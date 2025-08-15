import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postApi, type Post } from '@/entities/post';
import { queryKeys } from '@/shared/api';

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

  const queryKey = useMemo(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      return queryKeys.posts.search(searchQuery);
    }
    if (tag && tag !== 'all') {
      return queryKeys.posts.byTag(tag);
    }
    return queryKeys.posts.list({ limit, skip, searchQuery, tag });
  }, [limit, skip, searchQuery, tag]);

  const queryFn = useMemo(() => {
    return async () => {
      if (searchQuery && searchQuery.trim().length > 0) {
        return await postApi.searchPosts(searchQuery);
      }
      if (tag && tag !== 'all') {
        return await postApi.getPostsByTag(tag);
      }
      return await postApi.getPosts({ limit, skip });
    };
  }, [limit, skip, searchQuery, tag]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn,
    select: (data) => ({
      posts: data.posts || [],
      total: data.total ?? data.posts?.length ?? 0,
    }),
  });

  const sortedPosts = useMemo(
    () => sortPosts(data?.posts || [], sortBy, sortOrder),
    [data?.posts, sortBy, sortOrder],
  );

  return {
    posts: sortedPosts,
    total: data?.total || 0,
    loading: isLoading,
    error: error?.message || null,
    refetch: () => void refetch(),
  };
}
