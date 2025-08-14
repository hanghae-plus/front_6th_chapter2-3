import { useEffect, useMemo, useState } from 'react';

import {
  useGetPostsBySearchQuery,
  useGetPostsByTagQuery,
  useGetPostsQuery,
} from '@/entities/post';
import { useGetUsersQuery } from '@/entities/user';
import { usePostsFilterStore } from '@/shared/lib';

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
    setPagination,
  } = usePostsFilterStore();

  const [posts, setPosts] = useState<PostWithAuthor<SelectedUserProperties>[]>(
    []
  );

  const baseFilters = {
    limit,
    skip,
    sortBy,
    sortOrder,
  };

  const filtersWithTag = {
    ...baseFilters,
    tag: selectedTag,
  };

  const filtersWithSearch = {
    ...baseFilters,
    search: searchQuery,
  };

  const { data: usersData, isLoading: isLoadingUsers } =
    useGetUsersQuery<SelectedUserProperties>({
      limit: 0,
      select: ['id', 'username', 'image'],
    });

  const { data: postsData, isLoading: isLoadingPosts } = useGetPostsQuery({
    ...baseFilters,
  });

  const { data: postsByTagData, isLoading: isLoadingPostsByTag } =
    useGetPostsByTagQuery({
      ...filtersWithTag,
    });

  const { data: postsBySearchData, isLoading: isLoadingPostsBySearch } =
    useGetPostsBySearchQuery({
      ...filtersWithSearch,
    });

  const postsWithAuthor = useMemo(() => {
    return getPostsWithAuthor<SelectedUserProperties>(
      postsData?.posts ?? [],
      usersData?.users ?? []
    );
  }, [postsData?.posts, usersData?.users, ...[Object.values(baseFilters)]]);

  const postsWithAuthorByTag = useMemo(() => {
    return getPostsWithAuthor<SelectedUserProperties>(
      postsByTagData?.posts ?? [],
      usersData?.users ?? []
    );
  }, [
    postsByTagData?.posts,
    usersData?.users,
    selectedTag,
    ...[Object.values(filtersWithTag)],
  ]);

  const postsWithAuthorBySearch = useMemo(() => {
    return getPostsWithAuthor<SelectedUserProperties>(
      postsBySearchData?.posts ?? [],
      usersData?.users ?? []
    );
  }, [
    postsBySearchData?.posts,
    usersData?.users,
    ...[Object.values(filtersWithSearch)],
  ]);

  const isLoading =
    isLoadingUsers ||
    isLoadingPosts ||
    isLoadingPostsByTag ||
    isLoadingPostsBySearch;

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
