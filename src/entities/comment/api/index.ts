import { Comment, NewComment } from '../types';

// PostsManagerPage.tsx에서 그대로 복사한 Comment 관련 함수들
// 댓글 가져오기
export const fetchComments = async (
  postId: number,
  comments: Record<number, Comment[]>,
  setComments: (comments: Record<number, Comment[]>) => void,
) => {
  if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
  try {
    const response = await fetch(`/api/comments/post/${postId}`);
    const data = await response.json();
    setComments((prev) => ({ ...prev, [postId]: data.comments }));
  } catch (error) {
    console.error('댓글 가져오기 오류:', error);
  }
};

// 댓글 추가
export const addComment = async (
  setComments: (comments: Record<number, Comment[]>) => void,
  comments: Record<number, Comment[]>,
  setShowAddCommentDialog: (show: boolean) => void,
  setNewComment: (comment: NewComment) => void,
  newComment: NewComment,
) => {
  try {
    const response = await fetch('/api/comments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    });
    const data = await response.json();
    setComments((prev) => ({
      ...prev,
      [data.postId]: [...(prev[data.postId] || []), data],
    }));
    setShowAddCommentDialog(false);
    setNewComment({ body: '', postId: null, userId: 1 });
  } catch (error) {
    console.error('댓글 추가 오류:', error);
  }
};

// 댓글 업데이트
export const updateComment = async (
  setComments: (comments: Record<number, Comment[]>) => void,
  comments: Record<number, Comment[]>,
  setShowEditCommentDialog: (show: boolean) => void,
  selectedComment: Comment,
) => {
  try {
    const response = await fetch(`/api/comments/${selectedComment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: selectedComment.body }),
    });
    const data = await response.json();
    setComments((prev) => ({
      ...prev,
      [data.postId]: prev[data.postId].map((comment) =>
        comment.id === data.id ? data : comment,
      ),
    }));
    setShowEditCommentDialog(false);
  } catch (error) {
    console.error('댓글 업데이트 오류:', error);
  }
};

// 댓글 삭제
export const deleteComment = async (
  setComments: (comments: Record<number, Comment[]>) => void,
  comments: Record<number, Comment[]>,
  id: number,
  postId: number,
) => {
  try {
    await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    });
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((comment) => comment.id !== id),
    }));
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
  }
};

// 댓글 좋아요
export const likeComment = async (
  setComments: (comments: Record<number, Comment[]>) => void,
  comments: Record<number, Comment[]>,
  id: number,
  postId: number,
) => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: comments[postId].find((c) => c.id === id)?.likes + 1 }),
    });
    const data = await response.json();
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].map((comment) =>
        comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
      ),
    }));
  } catch (error) {
    console.error('댓글 좋아요 오류:', error);
  }
};
