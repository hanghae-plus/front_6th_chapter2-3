import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { GetPostsParams, Post, postQueryOptions } from '@/entities/post';
import { GetUsersParams, User, userQueryOptions } from '@/entities/user';
import { getPostsWithAuthor } from '@/features/posts-list/lib/posts-utils';

export const useGetPostsWithAuthorQueries = ({
  postParams,
  userParams,
}: {
  postParams: GetPostsParams;
  userParams: GetUsersParams;
}) => {
  const [getPostQuery, getUserQuery] = useQueries({
    queries: [
      postQueryOptions.getPosts(postParams),
      userQueryOptions.getUsers(userParams),
    ],
  });

  const postsWithAuthor = useMemo(() => {
    const posts: Post[] = getPostQuery.data?.posts ?? [];
    const users: User[] = getUserQuery.data?.users ?? [];

    return getPostsWithAuthor(posts, users);
  }, [getPostQuery.data?.posts, getUserQuery.data?.users]);

  const isLoading = getPostQuery.isLoading || getUserQuery.isLoading;
  const isError = getPostQuery.isError || getUserQuery.isError;
  const error = getPostQuery.error || getUserQuery.error;

  return {
    data: postsWithAuthor,
    isLoading,
    isError,
    error,
  };
};
