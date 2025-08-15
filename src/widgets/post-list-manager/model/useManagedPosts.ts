import { useMemo } from 'react';

import { Post } from '@/entities/post/model/types';
import { useSearchPosts, useFetchPostsByTag, useFetchPosts } from '@/entities/post/model/usePosts';
import { useFetchAllUsers } from '@/entities/user/model/useUsers';
import { usePostFilterStore, usePostSearchStore, usePaginationStore } from '@/features';

/**
 * @description PostListManager Widget에 필요한 모든 데이터를 조합하고 관리하는 훅
 */
export const useManagedPosts = () => {
  const { searchQuery } = usePostSearchStore();
  const { selectedTag, sortBy, sortOrder } = usePostFilterStore();
  const { limit, skip } = usePaginationStore();

  const { data: searchData } = useSearchPosts(searchQuery);
  const { data: tagData } = useFetchPostsByTag(selectedTag);
  const { data: postsData, isLoading } = useFetchPosts(limit, skip, sortBy, sortOrder);

  const finalData = searchData || tagData || postsData;
  const { data: usersData } = useFetchAllUsers();

  const postsWithAuthors = useMemo(() => {
    if (!finalData?.posts || !usersData) return [];
    return finalData.posts.map((post: Post) => ({
      ...post,
      author: usersData.find((user) => user.id === post.userId),
    }));
  }, [finalData, usersData]);

  return {
    posts: postsWithAuthors,
    total: finalData?.total || 0,
    isLoading,
  };
};
