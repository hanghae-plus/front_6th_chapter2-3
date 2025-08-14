import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addPost,
  addPostComment,
  deletePost,
  deletePostComment,
  editPost,
  patchPostCommentLike,
  updatePostComment,
  type AddPostRequest,
  type AddPostResponse,
  type UpdatePostCommentRequest,
} from '../api';
import {
  addCommentData,
  deleteComment,
  deletePostData,
  editPostData,
  incrementCommentLike,
  updateComment,
} from './mutate';
import {
  POST_QUERY_KEYS,
  usePostsQueryKey,
  type Post,
  type PostCommentsResponse,
  type PostsResponse,
} from '@/entities/posts';

// 게시물 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const postsQueryKey = usePostsQueryKey();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({
        queryKey: postsQueryKey,
      });

      const previousPosts = queryClient.getQueryData(postsQueryKey);

      queryClient.setQueryData(postsQueryKey, (old: PostsResponse) => {
        return {
          ...old,
          posts: deletePostData(old.posts, postId),
        };
      });

      return { previousPosts };
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
        POST_QUERY_KEYS.postComments(postId),
        (old: PostCommentsResponse) => {
          return {
            ...old,
            comments: addCommentData(old.comments, { ...data, likes: 0 }),
          };
        },
      );
    },
  });
};

// 게시물 추가
export const useAddPost = () => {
  const queryClient = useQueryClient();
  const postsQueryKey = usePostsQueryKey();

  return useMutation({
    mutationFn: (postData: AddPostRequest) => addPost(postData),
    onMutate: async (postData) => {
      await queryClient.cancelQueries({
        queryKey: postsQueryKey,
      });

      const previousPosts = queryClient.getQueryData(postsQueryKey);

      queryClient.setQueryData(postsQueryKey, (old: AddPostResponse) => {
        return {
          ...old,
          posts: [postData, ...old.posts],
          total: old.total + 1,
        };
      });

      return { previousPosts };
    },
  });
};

// 게시물 업데이트
export const useEditPost = () => {
  const queryClient = useQueryClient();
  const postsQueryKey = usePostsQueryKey();

  return useMutation({
    mutationFn: ({ postId, post }: { postId: number; post: Post }) =>
      editPost(postId, post),
    onMutate: async ({ postId, post }) => {
      await queryClient.cancelQueries({
        queryKey: postsQueryKey,
      });

      const previousPosts = queryClient.getQueryData(postsQueryKey);

      queryClient.setQueryData(postsQueryKey, (old: PostsResponse) => {
        return {
          ...old,
          posts: editPostData(old.posts, postId, post),
        };
      });

      return { previousPosts };
    },
  });
};

// 개별 댓글 수정
export const useEditComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      commentData,
    }: {
      commentId: number;
      commentData: UpdatePostCommentRequest;
      postId: number;
    }) => updatePostComment(commentId, commentData),
    onMutate: async ({ commentId, commentData, postId }) => {
      await queryClient.cancelQueries({
        queryKey: POST_QUERY_KEYS.postComments(postId),
      });

      const previousComments = queryClient.getQueryData(
        POST_QUERY_KEYS.postComments(postId),
      );

      queryClient.setQueryData(
        POST_QUERY_KEYS.postComments(postId),
        (old: PostCommentsResponse) => {
          return {
            ...old,
            comments: updateComment(old.comments, commentId, commentData.body),
          };
        },
      );

      return { previousComments };
    },
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
        queryClient.getQueryData(POST_QUERY_KEYS.postComments(postId));

      const likes =
        (previousComments?.comments ?? []).find(
          (comment) => comment.id === commentId,
        )?.likes ?? null;

      if (typeof likes !== 'number') {
        throw new Error('Likes not found');
      }

      return patchPostCommentLike(commentId, likes);
    },
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({
        queryKey: POST_QUERY_KEYS.postComments(postId),
      });

      const previousComments = queryClient.getQueryData(
        POST_QUERY_KEYS.postComments(postId),
      );

      queryClient.setQueryData(
        POST_QUERY_KEYS.postComments(postId),
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
        queryKey: POST_QUERY_KEYS.postComments(postId),
      });

      const previousComments = queryClient.getQueryData(
        POST_QUERY_KEYS.postComments(postId),
      );

      queryClient.setQueryData(
        POST_QUERY_KEYS.postComments(postId),
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
