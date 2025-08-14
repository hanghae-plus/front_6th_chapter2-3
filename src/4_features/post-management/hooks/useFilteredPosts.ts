import { useEffect, useMemo, useState } from 'react';

import {
  useGetPostsBySearchQuery,
  useGetPostsByTagQuery,
  useGetPostsQuery,
} from '@/entities/post';
import { useGetUsersQuery } from '@/entities/user';
import { usePostsFilterStore } from '@/shared/index';

import { getPostsWithAuthor } from '../lib/post.util';
import { PostWithAuthor } from '../types';

export const useFilteredPosts = () => {
  const { selectedTag, searchQuery } = usePostsFilterStore();

  const [posts, setPosts] = useState<PostWithAuthor[]>([]);

  const { data: usersData } = useGetUsersQuery({ limit: 10, select: 'id' });
  const { data: postsData } = useGetPostsQuery({ limit: 10, skip: 0 });

  // 조건부로 쿼리 실행
  const { data: postsByTagData } = useGetPostsByTagQuery(
    selectedTag && selectedTag !== 'all' ? selectedTag : ''
  );
  const { data: postsBySearchData } = useGetPostsBySearchQuery(
    searchQuery ? searchQuery : ''
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
    if (searchQuery && searchQuery.trim()) {
      setPosts(postsWithAuthorBySearch);
      return;
    }

    // 태그가 있고 'all'이 아니면 태그 결과 사용
    if (selectedTag && selectedTag !== 'all' && selectedTag.trim()) {
      setPosts(postsWithAuthorByTag);
      return;
    }

    // 기본 게시물 목록 사용
    setPosts(postsWithAuthor);
  }, [
    postsWithAuthor,
    postsWithAuthorByTag,
    postsWithAuthorBySearch,
    searchQuery,
    selectedTag,
  ]);

  return {
    posts,
    setPosts,
  };
};
