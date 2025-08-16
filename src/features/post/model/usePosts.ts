// user 엔티티도 필요하므로 feature에 위치
import {
  usePostListQuery,
  usePostListBySearchQuery,
  useGetPostListByTagQuery,
  useUserListQuery,
  PostType,
} from '../../../entities';

interface UsePostsParamsType {
  skip?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  searchQuery?: string;
  tag?: string;
}

export const usePosts = (params: UsePostsParamsType) => {
  const { skip, limit, sortBy, sortOrder, searchQuery, tag } = params;

  // 검색어가 있을 때만 검색 쿼리 실행
  const { data: searchPostData, isLoading: isPostSearchLoading } = usePostListBySearchQuery(
    searchQuery || '',
    { skip, limit, sortBy, sortOrder }, // 파라미터 전달
    {
      enabled: !!searchQuery,
    },
  );

  // 태그가 있을 때만 태그 쿼리 실행
  const { data: tagPostData, isLoading: isPostTagLoading } = useGetPostListByTagQuery(
    tag || '',
    { skip, limit, sortBy, sortOrder }, // 파라미터 전달
    {
      enabled: !!tag, // 검색어가 없을 때만
    },
  );

  // 일반 목록 쿼리 (검색어나 태그가 없을 때만)
  const { data, isLoading } = usePostListQuery({ skip, limit, sortBy, sortOrder });

  const { data: userData } = useUserListQuery({
    limit: 1000,
    select: 'id,username,image',
  });

  const matchPostsWithUsers = (posts: PostType[]) => {
    return posts.map((post) => ({
      ...post,
      author: userData?.users.find((user) => user.id === post.userId),
    }));
  };

  // 검색어가 있는 경우
  if (searchQuery) {
    return {
      posts: matchPostsWithUsers(searchPostData?.posts || []),
      total: searchPostData?.total || 0,
      isLoading: isPostSearchLoading,
    };
  }

  // 태그가 있는 경우
  if (tag) {
    return {
      posts: matchPostsWithUsers(tagPostData?.posts || []),
      total: tagPostData?.total || 0,
      isLoading: isPostTagLoading,
    };
  }

  return {
    posts: matchPostsWithUsers(data?.posts || []),
    total: data?.total || 0,
    isLoading,
  };
};
