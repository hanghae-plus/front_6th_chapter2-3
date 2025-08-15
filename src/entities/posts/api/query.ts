import { useQuery } from '@tanstack/react-query';
import {
  useLimit,
  useSearchQuery,
  useSkip,
  useSortBy,
  useSortOrder,
  useTag,
} from '../model';
import { getPostComments, getPosts, getPostsTags } from './remote';
import { POST_QUERY_KEYS } from './query-keys';

// 게시글 목록 가져오기
export const usePosts = () => {
  const [limit] = useLimit();
  const [skip] = useSkip();
  const [searchQuery] = useSearchQuery();
  const [selectedTag] = useTag();
  const [sortBy] = useSortBy();
  const [sortOrder] = useSortOrder();

  return useQuery({
    queryKey: POST_QUERY_KEYS.posts(
      limit,
      skip,
      searchQuery,
      selectedTag,
      sortBy,
      sortOrder,
    ),
    queryFn: () =>
      getPosts(limit, skip, searchQuery, selectedTag, sortBy, sortOrder),
  });
};

// 게시글 태그 목록 가져오기
export const usePostsTags = () => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.postsTags(),
    queryFn: () => getPostsTags(),
  });
};

// 개별 게시글 댓글 목록 가져오기
export const usePostComments = (postId?: number) => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.postComments(postId!),
    enabled: !!postId,
    queryFn: () => getPostComments(postId!),
  });
};
