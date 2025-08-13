import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { queryKeys } from '@/shared/index';

import { getUsers, GetUsersParams } from '../user';
import { getPosts, GetPostsParams } from './post.api';

export const useGetPostsWithAuthor = ({
  postParams,
  userParams,
}: {
  postParams: GetPostsParams;
  userParams: GetUsersParams;
}) => {
  const [getPostQuery, getUserQuery] = useQueries({
    queries: [
      {
        queryKey: queryKeys.posts.list(postParams),
        queryFn: () => getPosts(postParams),
      },
      {
        queryKey: queryKeys.users.list(userParams),
        queryFn: () => getUsers(userParams),
      },
    ],
  });

  const postsWithAuthor = useMemo(() => {
    const posts = getPostQuery.data?.posts ?? [];
    const users = getUserQuery.data?.users ?? [];

    return posts.map(post => ({
      ...post,
      author: users?.find(user => user.id === post.userId),
    }));
  }, [getPostQuery.data?.posts, getUserQuery.data?.users]);

  const isLoading = getPostQuery.isLoading || getUserQuery.isLoading;
  const isError = getPostQuery.isError || getUserQuery.isError;
  const error = getPostQuery.error || getUserQuery.error;

  return {
    postsWithAuthor,
    isLoading,
    isError,
    error,
  };
};
