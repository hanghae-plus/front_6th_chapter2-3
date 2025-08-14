import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addComment,
  deleteComment,
  getLikes,
  incrementCommentLike,
  updateComment,
  updatePost as updatePostData,
  deletePost as deletePostData,
  useLimit,
  useSearchQuery,
  useSkip,
  useSortBy,
  useSortOrder,
  useTag,
  type AddPostRequest,
  type Post,
  type PostCommentsResponse,
  type PostsResponse,
  type UpdatePostCommentRequest,
} from '../model';
import {
  addPost,
  addPostComment,
  deletePost,
  deletePostComment,
  getPostComments,
  getPosts,
  getPostsTags,
  patchPostCommentLike,
  updatePost,
  updatePostComment,
} from './remote';
import { POST_QUERY_KEYS } from './query-keys';
import { usePostsQueryKey } from './usePostsQuerykey';

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

      const likes = getLikes(previousComments?.comments ?? [], commentId);

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
            comments: addComment(old.comments, { ...data, likes: 0 }),
          };
        },
      );
    },
  });
};

// 개별 댓글 수정
export const useUpdatePostComment = () => {
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

// 게시물 업데이트
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const postsQueryKey = usePostsQueryKey();

  return useMutation({
    mutationFn: ({ postId, post }: { postId: number; post: Post }) =>
      updatePost(postId, post),
    onMutate: async ({ postId, post }) => {
      await queryClient.cancelQueries({
        queryKey: postsQueryKey,
      });

      const previousPosts = queryClient.getQueryData(postsQueryKey);

      queryClient.setQueryData(postsQueryKey, (old: PostsResponse) => {
        return {
          ...old,
          posts: updatePostData(old.posts, postId, post),
        };
      });

      return { previousPosts };
    },
  });
};

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

      queryClient.setQueryData(postsQueryKey, (old: PostsResponse) => {
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
