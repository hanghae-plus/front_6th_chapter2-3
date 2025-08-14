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

    // Zustand와 호환되도록 함수 대신 직접 값 전달
    const updatedComments = { ...comments, [postId]: data.comments };
    setComments(updatedComments);
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
    console.log('=== addComment API 호출 ===');
    console.log('전송할 데이터:', newComment);
    console.log('newComment.postId:', newComment.postId);
    console.log('newComment.body:', newComment.body);
    console.log('newComment.userId:', newComment.userId);
    
    const response = await fetch('/api/comments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    });
    
    console.log('API 응답 상태:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      throw new Error(`API 호출 실패: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API 응답 데이터:', data);
    console.log('응답 data.postId:', data.postId);
    
    // Zustand와 호환되도록 함수 대신 직접 값 전달
    const updatedComments = {
      ...comments,
      [data.postId]: [...(comments[data.postId] || []), data],
    };
    
    console.log('업데이트된 comments:', updatedComments);
    setComments(updatedComments);
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

    // Zustand와 호환되도록 함수 대신 직접 값 전달
    const updatedComments = {
      ...comments,
      [data.postId]: comments[data.postId].map((comment) =>
        comment.id === data.id ? data : comment,
      ),
    };

    setComments(updatedComments);
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

    // Zustand와 호환되도록 함수 대신 직접 값 전달
    const updatedComments = {
      ...comments,
      [postId]: comments[postId].filter((comment) => comment.id !== id),
    };

    setComments(updatedComments);
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
    const currentComment = comments[postId]?.find((c) => c.id === id);
    if (!currentComment) return;

    const response = await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: currentComment.likes + 1 }),
    });
    const data = await response.json();

    // Zustand와 호환되도록 함수 대신 직접 값 전달
    const updatedComments = {
      ...comments,
      [postId]: comments[postId].map((comment) =>
        comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
      ),
    };

    setComments(updatedComments);
  } catch (error) {
    console.error('댓글 좋아요 오류:', error);
  }
};
