import { useQuery } from '@tanstack/react-query';
import { IPosts, IPostTag } from './type';
import { getPostListApi, getPostTagListApi } from '../api/post-api';
import { PostsParams } from '../api/post-api';

/**
 * 게시글 목록 조회
 */
export const usePostListQuery = (params: PostsParams) => {
  return useQuery<IPosts>({
    queryKey: ['posts', params],
    queryFn: () => getPostListApi(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

/**
 * 게시물 태그 목록 조회
 */
export const usePostTagListQuery = () => {
  return useQuery<IPostTag[]>({
    queryKey: ['tags'],
    queryFn: getPostTagListApi,
  });
};
