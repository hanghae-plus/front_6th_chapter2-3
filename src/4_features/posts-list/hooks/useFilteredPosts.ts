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

  // 조건부로 쿼리 실행
  const { data: postsByTagData } = useGetPostsByTagQuery(
    tag && tag !== 'all' ? tag : ''
  );
  const { data: postsBySearchData } = useGetPostsBySearchQuery(
    search ? search : ''
  );

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
    // 검색어가 있으면 검색 결과 사용
    if (search && search.trim()) {
      setPosts(postsWithAuthorBySearch);
      return;
    }

    // 태그가 있고 'all'이 아니면 태그 결과 사용
    if (tag && tag !== 'all' && tag.trim()) {
      setPosts(postsWithAuthorByTag);
      return;
    }

    // 기본 게시물 목록 사용
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
