import { Comment, GetCommentsResponse } from '@/entities/comment';
import { GetPostsResponse, Post } from '@/entities/post';

/**
 * 게시물 낙관적 업데이트 유틸리티
 *
 * FSD Best Practice:
 * - 도메인별 로직 분리
 * - 타입 안전성 보장
 * - 재사용 가능한 함수
 * - 일관된 반환 타입
 */
export const optimisticPostUpdates = {
  /**
   * 게시물 생성 낙관적 업데이트
   */
  create: (
    newPost: Omit<Post, 'id'>,
    oldData: GetPostsResponse | undefined
  ): GetPostsResponse => {
    if (!oldData) {
      return {
        posts: [{ ...newPost, id: Date.now() }],
        total: 1,
        skip: 0,
        limit: 10,
      };
    }

    const postToAdd: Post = {
      ...newPost,
      id: oldData.total ? oldData.total + 1 : Date.now(),
    };

    return {
      ...oldData,
      posts: [postToAdd, ...(oldData.posts || [])],
      total: oldData.total + 1,
    };
  },

  /**
   * 게시물 수정 낙관적 업데이트
   */
  update: (
    updatedPost: Post,
    oldData: GetPostsResponse | undefined
  ): GetPostsResponse => {
    if (!oldData || !oldData.posts) {
      return {
        posts: [],
        total: 0,
        skip: 0,
        limit: 10,
      };
    }

    return {
      ...oldData,
      posts: oldData.posts.map((post: Post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    };
  },

  /**
   * 게시물 삭제 낙관적 업데이트
   */
  delete: (
    postId: number,
    oldData: GetPostsResponse | undefined
  ): GetPostsResponse => {
    if (!oldData || !oldData.posts) {
      return {
        posts: [],
        total: 0,
        skip: 0,
        limit: 10,
      };
    }

    return {
      ...oldData,
      posts: oldData.posts.filter((post: Post) => post.id !== postId),
      total: Math.max(0, oldData.total - 1),
    };
  },
};

/**
 * 댓글 낙관적 업데이트 유틸리티
 *
 * FSD Best Practice:
 * - 도메인별 로직 분리
 * - 타입 안전성 보장
 * - 재사용 가능한 함수
 * - 일관된 반환 타입
 */
export const optimisticCommentUpdates = {
  /**
   * 댓글 생성 낙관적 업데이트
   */
  create: (
    newComment: Omit<Comment, 'id'>,
    oldData: GetCommentsResponse | undefined
  ): GetCommentsResponse => {
    if (!oldData) {
      return {
        comments: [{ ...newComment, id: Date.now() }],
        total: 1,
        skip: 0,
        limit: 10,
      };
    }

    const commentToAdd: Comment = {
      ...newComment,
      id: oldData.total ? oldData.total + 1 : Date.now(),
    };

    return {
      ...oldData,
      comments: [commentToAdd, ...(oldData.comments || [])],
      total: oldData.total + 1,
    };
  },

  /**
   * 댓글 수정 낙관적 업데이트
   */
  update: (
    updatedComment: Comment,
    oldData: GetCommentsResponse | undefined
  ): GetCommentsResponse => {
    if (!oldData || !oldData.comments) {
      return {
        comments: [],
        total: 0,
        skip: 0,
        limit: 10,
      };
    }

    return {
      ...oldData,
      comments: oldData.comments.map((comment: Comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      ),
    };
  },

  /**
   * 댓글 삭제 낙관적 업데이트
   */
  delete: (
    commentId: number,
    oldData: GetCommentsResponse | undefined
  ): GetCommentsResponse => {
    if (!oldData || !oldData.comments) {
      return {
        comments: [],
        total: 0,
        skip: 0,
        limit: 10,
      };
    }

    return {
      ...oldData,
      comments: oldData.comments.filter(
        (comment: Comment) => comment.id !== commentId
      ),
      total: Math.max(0, oldData.total - 1),
    };
  },
};
