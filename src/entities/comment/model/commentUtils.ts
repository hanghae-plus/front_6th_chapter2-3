// 댓글 관련 비즈니스 로직 함수들 (PostsManagerPage에서만 사용)

// 댓글 추가 시 postId 설정 유틸리티
export const handleAddCommentWithPostId = (
  selectedPost: any,
  newComment: any,
  setNewComment: (comment: any) => void,
  handleAddCommentWithData: (commentData: any) => void
) => {
  if (selectedPost) {
    // userId를 보존하면서 postId만 업데이트
    const updatedComment = {
      ...newComment,
      postId: selectedPost.id,
      userId: newComment.userId || 1, // userId가 없으면 기본값 1 사용
    };

    // setNewComment 완료 후 댓글 추가 함수 호출
    setNewComment(updatedComment);

    // 상태 업데이트가 완료된 후 댓글 추가 실행
    const addCommentWithUpdatedData = () => {
      // updatedComment를 직접 사용하여 API 호출
      handleAddCommentWithData(updatedComment);
    };

    // 다음 렌더링 사이클에서 실행
    setTimeout(addCommentWithUpdatedData, 0);
  } else {
    console.error('selectedPost가 없습니다!');
  }
};

// 특정 데이터로 댓글 추가하는 유틸리티
export const handleAddCommentWithData = async (
  commentData: any,
  setComments: (comments: any) => void,
  comments: any,
  setShowAddCommentDialog: (show: boolean) => void,
  setNewComment: (comment: any) => void
) => {
  try {
    const response = await fetch('/api/comments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      throw new Error(`API 호출 실패: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // 댓글 상태 업데이트
    const updatedComments = {
      ...comments,
      [data.postId]: [...(comments[data.postId] || []), data],
    };

    setComments(updatedComments);
    setShowAddCommentDialog(false);
    setNewComment({ body: '', postId: null, userId: 1 });
  } catch (error) {
    console.error('댓글 추가 오류:', error);
  }
};
