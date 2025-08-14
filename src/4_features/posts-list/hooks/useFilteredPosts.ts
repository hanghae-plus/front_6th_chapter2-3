import { useEffect, useMemo, useState } from 'react';

import {
  useGetPostsBySearchQuery,
  useGetPostsByTagQuery,
  useGetPostsQuery,
} from '@/entities/post';
import { useGetUsersQuery } from '@/entities/user';
import type { PostWithAuthor } from '@/features/posts-list';
import { getPostsWithAuthor } from '@/features/posts-list/lib/posts-utils';

interface Props {
  tag: string;
  search: string;
}

export const useFilteredPosts = ({ tag, search }: Props) => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);

  const { data: usersData } = useGetUsersQuery({ limit: 10, select: 'id' });
  const { data: postsData } = useGetPostsQuery({ limit: 10, skip: 0 });
  const { data: postsByTagData } = useGetPostsByTagQuery(tag ?? '');
  const { data: postsBySearchData } = useGetPostsBySearchQuery(search ?? '');

  const postsWithAuthor = useMemo(() => {
    return getPostsWithAuthor(postsData?.posts ?? [], usersData?.users ?? []);
  }, [postsData?.posts, usersData?.users]);

  const postsWithAuthorByTag = useMemo(() => {
    return getPostsWithAuthor(
      postsByTagData?.posts ?? [],
      usersData?.users ?? []
    );
  }, [postsByTagData?.posts, usersData?.users]);

  const postsWithAuthorBySearch = useMemo(() => {
    return getPostsWithAuthor(
      postsBySearchData?.posts ?? [],
      usersData?.users ?? []
    );
  }, [postsBySearchData?.posts, usersData?.users]);

  useEffect(() => {
    if (search) {
      setPosts(postsWithAuthorBySearch);
      return;
    }

    if (tag) {
      setPosts(postsWithAuthorByTag);
      return;
    }

    setPosts(postsWithAuthor);
  }, [
    postsWithAuthor,
    postsWithAuthorByTag,
    postsWithAuthorBySearch,
    search,
    tag,
  ]);

  return {
    posts,
    setPosts,
  };
};
