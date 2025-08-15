import {
  PostCommentRequestType,
  PostCommentResponseType,
  PutCommentRequestType,
  CommentType,
  GetCommentsResponseType,
} from "@/entities/comment/model/types";
import { createApi } from "@/shared/api/baseApi";

const api = createApi();

export const commentApi = {
  // 댓글 목록 조회
  async getComments(postId: number): Promise<GetCommentsResponseType> {
    return api.get<GetCommentsResponseType>(`/comments/post/${postId}`);
  },
  // 댓글 추가
  async createComment(
    commentData: PostCommentRequestType,
  ): Promise<PostCommentResponseType> {
    return api.post<PostCommentResponseType>("/comments/add", commentData);
  },

  // 댓글 수정
  async updateComment(
    id: number,
    commentData: Pick<PutCommentRequestType, "body">,
  ): Promise<CommentType> {
    return api.put<CommentType>(`/comments/${id}`, commentData);
  },

  // 댓글 삭제
  async deleteComment(id: number): Promise<void> {
    return api.delete(`/comments/${id}`);
  },

  // 댓글 좋아요
  async likeComment(id: number, currentLikes: number): Promise<CommentType> {
    return api.patch<CommentType>(`/comments/${id}`, {
      likes: currentLikes + 1,
    });
  },
};
