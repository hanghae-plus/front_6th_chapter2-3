import { useEffect, useMemo, useState } from 'react';

import {
  AllFilterParams,
  useGetPostsBySearchQuery,
  useGetPostsByTagQuery,
  useGetPostsQuery,
} from '@/entities/post';
import { useGetUsersQuery } from '@/entities/user';
import { POST_QUERY_TYPE, usePostsFilterStore } from '@/shared/lib';

import { getPostsWithAuthor } from '../../post-management/lib/post.util';
import { PostWithAuthor } from '../../post-management/types';

export type SelectedUserProperties = 'id' | 'username' | 'image';

export const useFilteredPosts = () => {
  const {
    selectedTag,
    searchQuery,
    limit,
    skip,
    sortBy,
    sortOrder,
    pagination,
    setQueryType,
    setPagination,
  } = usePostsFilterStore();

  const [posts, setPosts] = useState<PostWithAuthor<SelectedUserProperties>[]>(
    []
  );

  const filters: AllFilterParams = {
    limit,
    skip,
    sortBy,
    sortOrder,
    searchQuery,
    selectedTag,
  };

  const { data: usersData, isLoading: isLoadingUsers } =
    useGetUsersQuery<SelectedUserProperties>({
      limit: 0,
      select: ['id', 'username', 'image'],
    });

  const { data: postsData, isLoading: isLoadingPosts } = useGetPostsQuery({
    limit,
    skip,
    sortBy,
    sortOrder,
  });

  const { data: postsByTagData, isLoading: isLoadingPostsByTag } =
    useGetPostsByTagQuery({
      limit,
      skip,
      sortBy,
      sortOrder,
      selectedTag,
    });

  const { data: postsBySearchData, isLoading: isLoadingPostsBySearch } =
    useGetPostsBySearchQuery({
      limit,
      skip,
      sortBy,
      sortOrder,
      searchQuery,
    });

  const postsWithAuthor = useMemo(() => {
    return getPostsWithAuthor<SelectedUserProperties>(
      postsData?.posts ?? [],
      usersData?.users ?? []
    );
  }, [postsData?.posts, usersData?.users, ...[Object.values(filters)]]);

  const postsWithAuthorByTag = useMemo(() => {
    return getPostsWithAuthor<SelectedUserProperties>(
      postsByTagData?.posts ?? [],
      usersData?.users ?? []
    );
  }, [
    postsByTagData?.posts,
    usersData?.users,
    selectedTag,
    ...[Object.values(filters)],
  ]);

  const postsWithAuthorBySearch = useMemo(() => {
    return getPostsWithAuthor<SelectedUserProperties>(
      postsBySearchData?.posts ?? [],
      usersData?.users ?? []
    );
  }, [postsBySearchData?.posts, usersData?.users, ...[Object.values(filters)]]);

  const isLoading =
    isLoadingUsers ||
    isLoadingPosts ||
    isLoadingPostsByTag ||
    isLoadingPostsBySearch;

  useEffect(() => {
    // 검색어가 있으면 검색 결과 사용
    if (searchQuery && searchQuery.trim()) {
      setPosts(postsWithAuthorBySearch);
      setQueryType(POST_QUERY_TYPE.SEARCH);
      return;
    }

    // 태그가 있고 'all'이 아니면 태그 결과 사용
    if (selectedTag && selectedTag !== 'all' && selectedTag.trim()) {
      setPosts(postsWithAuthorByTag);
      setQueryType(POST_QUERY_TYPE.TAG);
      return;
    }

    // 기본 게시물 목록 사용
    setPosts(postsWithAuthor);
    setQueryType(POST_QUERY_TYPE.BASE);
  }, [
    postsWithAuthor,
    postsWithAuthorByTag,
    postsWithAuthorBySearch,
    searchQuery,
    selectedTag,
  ]);

  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setPagination({
        ...pagination,
        total: postsBySearchData?.total ?? 0,
      });
      return;
    }

    // 태그가 있고 'all'이 아니면 태그 결과 사용
    if (selectedTag && selectedTag !== 'all' && selectedTag.trim()) {
      setPagination({
        ...pagination,
        total: postsByTagData?.total ?? 0,
      });
      return;
    }

    // 기본 게시물 목록 사용
    setPagination({
      ...pagination,
      total: postsData?.total ?? 0,
    });
  }, [postsBySearchData, postsByTagData, postsData]);

  return {
    posts,
    setPosts,
    isLoading,
  };
};
