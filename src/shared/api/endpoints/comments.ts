import { apiClient } from "../client";

export interface CommentDTO {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

export interface CreateCommentRequestDTO {
  body: string;
  postId: number;
  userId: number;
}

export interface UpdateCommentRequestDTO {
  body: string;
}

export interface CommentsResponseDTO {
  comments: CommentDTO[];
  total: number;
  skip: number;
  limit: number;
}

export const commentsRequests = {
  // 게시물별 댓글 조회
  getCommentsByPost: async (postId: number) => {
    return apiClient.get<CommentsResponseDTO>(`/comments/post/${postId}`);
  },

  // 댓글 생성
  createComment: async (data: CreateCommentRequestDTO) => {
    return apiClient.post<CommentDTO>("/comments/add", data);
  },

  // 댓글 수정
  updateComment: async (id: number, data: UpdateCommentRequestDTO) => {
    return apiClient.put<CommentDTO>(`/comments/${id}`, data);
  },

  // 댓글 삭제
  deleteComment: async (id: number) => {
    return apiClient.delete<void>(`/comments/${id}`);
  },

  // 댓글 좋아요
  likeComment: async (id: number, likes: number) => {
    return apiClient.patch<CommentDTO>(`/comments/${id}`, { likes });
  },
};
