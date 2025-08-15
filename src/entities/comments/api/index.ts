import {
  Comments,
  CommentsResponse,
  PostAddComment,
  PutCommentsDetail,
} from '../model/types';
import { api } from '@/shared/lib/api.ts';

/**
 * Comments API
 */
export const commentsApi = {
  /**
   * 댓글 조회
   */
  getComments: async (postId: number) => {
    return api.get<{ comments: Comments[] }>(`/comments/post/${postId}`);
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
    commentData: PutCommentsDetail,
  ): Promise<CommentsResponse> => {
    return api.put<CommentsResponse, { body: string }>(
      `/comments/${commentData.id}`,
      {
        body: commentData.body,
      },
    );
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
