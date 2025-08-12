import { COMMENT } from '../config/constants';
import {
  IAddComment,
  IAddCommentResponse,
  IComment,
  IComments,
} from '../model/type';
import { createRequest } from '../../../shared/lib/api';

/**
 * 특정 게시물 댓글 목록 조회
 */
export const getCommentsApi = async (postId: number): Promise<IComments> => {
  const response = await fetch(COMMENT.LIST(postId));

  if (!response.ok) {
    throw new Error('댓글 목록 가져오기 오류');
  }

  return response.json();
};

/**
 * 댓글 추가
 */
export const addCommentApi = async (
  newComment: IAddComment
): Promise<IAddCommentResponse> => {
  const response = await fetch(COMMENT.ADD, createRequest('POST', newComment));

  if (!response.ok) {
    throw new Error('댓글 추가 오류');
  }

  return response.json();
};

/**
 * 댓글 업데이트
 */
export const updateCommentApi = async (
  updatedComment: Partial<IComment>
): Promise<IComment> => {
  if (!updatedComment.id) {
    throw new Error('게시물 ID 오류');
  }

  const response = await fetch(
    COMMENT.UPDATE(updatedComment.id),
    createRequest('PUT', updatedComment.body)
  );

  if (!response.ok) {
    throw new Error('댓글 업데이트 오류');
  }

  return response.json();
};

/**
 * 댓글 삭제
 */
export const deleteCommentApi = async (id: number): Promise<void> => {
  const response = await fetch(COMMENT.DELETE(id), createRequest('DELETE'));

  if (!response.ok) {
    throw new Error('댓글 삭제 오류');
  }
};

/**
 * 댓글 좋아요
 */
export const likeCommentApi = async (
  id: number,
  likeCount: number
): Promise<IComment> => {
  const response = await fetch(
    COMMENT.LIKE(id),
    createRequest('PATCH', { likes: likeCount })
  );

  if (!response.ok) {
    throw new Error('댓글 좋아요 오류');
  }

  return response.json();
};
