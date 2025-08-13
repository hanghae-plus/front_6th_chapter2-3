import {
  addPostComment,
  deletePostComment,
  getPostComments,
  getPosts,
  getPostsTags,
  patchPostCommentLike,
} from './remote';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addComment,
  deleteComment,
  getLikes,
  incrementCommentLike,
  type PostCommentsResponse,
} from '../model';
import { QUERY_KEYS } from '@/shared/config';

// 게시글 목록 가져오기
export const usePosts = (
  limit: number,
  skip: number,
  searchQuery: string = '',
  selectedTag: string = '',
) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts(limit, skip, searchQuery, selectedTag),
    queryFn: () => getPosts(limit, skip, searchQuery, selectedTag),
  });
};

// 게시글 태그 목록 가져오기
export const usePostsTags = () => {
  return useQuery({
    queryKey: QUERY_KEYS.postsTags(),
    queryFn: () => getPostsTags(),
  });
};

// 개별 게시글 댓글 목록 가져오기
export const usePostComments = (postId?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.postComments(postId!),
    enabled: !!postId,
    queryFn: () => getPostComments(postId!),
  });
};

// 개별 댓글 좋아요
export const usePostCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      postId,
    }: {
      commentId: number;
      postId: number;
    }) => {
      const previousComments: PostCommentsResponse | undefined =
        queryClient.getQueryData(QUERY_KEYS.postComments(postId));

      const likes = getLikes(previousComments?.comments ?? [], commentId);

      if (typeof likes !== 'number') {
        throw new Error('Likes not found');
      }

      return patchPostCommentLike(commentId, likes);
    },
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.postComments(postId),
      });

      const previousComments = queryClient.getQueryData(
        QUERY_KEYS.postComments(postId),
      );

      queryClient.setQueryData(
        QUERY_KEYS.postComments(postId),
        (old: PostCommentsResponse) => {
          return {
            ...old,
            comments: incrementCommentLike(old.comments, commentId),
          };
        },
      );

      return { previousComments };
    },
  });
};

// 개별 댓글 삭제
export const usePostCommentDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: number; postId: number }) =>
      deletePostComment(commentId),
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.postComments(postId),
      });

      const previousComments = queryClient.getQueryData(
        QUERY_KEYS.postComments(postId),
      );

      queryClient.setQueryData(
        QUERY_KEYS.postComments(postId),
        (old: PostCommentsResponse) => {
          return {
            ...old,
            comments: deleteComment(old.comments, commentId),
          };
        },
      );

      return { previousComments };
    },
  });
};

// 개별 댓글 추가
export const useAddPostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      body,
      postId,
    }: {
      userId: number;
      postId: number;
      body: string;
    }) => addPostComment(postId, userId, body),
    onSuccess: (data, { postId }) => {
      queryClient.setQueryData(
        QUERY_KEYS.postComments(postId),
        (old: PostCommentsResponse) => {
          return {
            ...old,
            comments: addComment(old.comments, { ...data, likes: 0 }),
          };
        },
      );
    },
  });
};
