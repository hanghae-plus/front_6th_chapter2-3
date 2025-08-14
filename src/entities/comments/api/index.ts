import { api } from '@/shared/lib/api.ts';

import {
  CommentsResponse,
  PostAddComment,
  PutCommentsDetail,
} from '../model/types';

/**
 * Comments API
 */
export const commentsApi = {
  /**
   * 댓글 조회
   */
  getComments: async (
    postId: number,
  ): Promise<{ comments: CommentsResponse[] }> => {
    return api.get<{ comments: CommentsResponse[] }>(
      `/comments/post/${postId}`,
    );
  },

  /**
   * 댓글 추가
   */
  addComment: async (comment: PostAddComment): Promise<CommentsResponse> => {
    return api.post<CommentsResponse, PostAddComment>('/comments/add', comment);
  },

  /**
   * 댓글 수정
   */
  updateComment: async (
    id: number,
    commentData: Omit<PutCommentsDetail, 'id'>,
  ): Promise<CommentsResponse> => {
    return api.put<CommentsResponse, { body: string }>(`/comments/${id}`, {
      body: commentData.body,
    });
  },

  /**
   * 댓글 삭제
   */
  deleteComment: async (id: number): Promise<void> => {
    return api.delete<void>(`/comments/${id}`);
  },

  /**
   * 댓글 좋아요
   */
  likeComment: async (id: number, likes: number): Promise<CommentsResponse> => {
    return api.patch<CommentsResponse, { likes: number }>(`/comments/${id}`, {
      likes,
    });
  },
};
