import { apiClient } from '../../../shared';
import { GetCommentsResponseType, PostCommentRequestType, PutCommentRequestType } from '../model';

export const getComments = async (postId: number): Promise<GetCommentsResponseType> => {
  return apiClient.get(`/comments/post/${postId}`);
};

export const postComment = async (comment: PostCommentRequestType) => {
  return apiClient.post('/comments/add', comment);
};

export const putComment = async (comment: PutCommentRequestType) => {
  return apiClient.put(`/comments/${comment.id}`, { body: comment.body });
};

export const deleteComment = async (data: { commentId: number; postId: number }) => {
  return apiClient.delete(`/comments/${data.commentId}`);
};

export const patchLikeComment = async (data: { commentId: number; postId: number }) => {
  return apiClient.patch(`/comments/${data.commentId}`, { likes: 1 });
};

export * from './mutations';
export * from './queries';
