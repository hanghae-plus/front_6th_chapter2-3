import { useCommentStore } from '../store/index';
import { Comment, NewComment } from '../../../entities/comment';
import { useCommentAPI } from '../api';

export const useCommentFeature = () => {
  // Zustand 스토어 직접 테스트
  console.log('=== Zustand 스토어 직접 테스트 ===');
  console.log('useCommentStore 함수:', useCommentStore);
  console.log('useCommentStore.getState():', useCommentStore.getState());

  // Zustand 스토어 사용 (기존 useState와 동일한 기능)
  const {
    comments,
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    setComments,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    clearNewComment,
    clearSelectedComment,
  } = useCommentStore();

  // 디버깅용 로그
  console.log('=== useCommentFeature 내부 ===');
  console.log('Zustand comments:', comments);
  console.log('Zustand setComments:', setComments);
  console.log('Zustand selectedComment:', selectedComment);
  console.log('Zustand newComment:', newComment);

  // API 호출 핸들러들 (새로운 useCommentAPI 사용)
  const commentAPI = useCommentAPI();

  const handleFetchComments = async (postId: number) => {
    console.log('handleFetchComments 호출, postId:', postId);
    await commentAPI.fetchCommentsWithState(postId, comments, setComments);
  };

  const handleAddComment = async () => {
    console.log('=== handleAddComment 시작 ===');
    console.log('현재 newComment:', newComment);
    console.log('현재 comments:', comments);
    console.log('setComments 함수:', setComments);

    await commentAPI.addCommentWithState(
      setComments,
      comments,
      setShowAddCommentDialog,
      setNewComment,
      newComment,
    );

    console.log('handleAddComment 완료');
  };

  const handleUpdateComment = async () => {
    if (selectedComment) {
      await commentAPI.updateCommentWithState(
        setComments,
        comments,
        setShowEditCommentDialog,
        selectedComment,
      );
    }
  };

  const handleDeleteComment = async (id: number, postId: number) => {
    await commentAPI.deleteCommentWithState(setComments, comments, id, postId);
  };

  const handleLikeComment = async (id: number, postId: number) => {
    await commentAPI.likeCommentWithState(setComments, comments, id, postId);
  };

  return {
    // 상태 (Zustand 스토어에서 가져옴)
    comments,
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    // 상태 설정자 (Zustand 스토어에서 가져옴)
    setComments,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    // 함수들 (기존과 동일)
    handleFetchComments,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    // 유틸리티 함수들 (Zustand 스토어에서 가져옴)
    clearNewComment,
    clearSelectedComment,
  };
};
