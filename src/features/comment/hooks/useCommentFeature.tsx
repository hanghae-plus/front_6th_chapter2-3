import { useCommentStore } from '../store/index';
import {
  useAddComment,
  useUpdateComment,
  useDeleteComment,
  useLikeComment,
} from './useCommentQueries';

export const useCommentFeature = () => {
  // 클라이언트 상태 (UI 상태) - Zustand 사용
  const {
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    clearNewComment,
    clearSelectedComment,
  } = useCommentStore();

  // TanStack Query 훅들 사용 (최상위에서 호출)
  const addCommentMutation = useAddComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const likeCommentMutation = useLikeComment();

  // 댓글 추가
  const handleAddComment = async (commentData?: any) => {
    const commentToAdd = commentData || newComment;

    if (!commentToAdd.body || !commentToAdd.postId) {
      console.error('댓글 추가 실패: body 또는 postId가 없습니다.', commentToAdd);
      return;
    }

    try {
      addCommentMutation.mutate(commentToAdd, {
        onSuccess: (data) => {
          console.log('댓글 추가 성공!', data);
          setShowAddCommentDialog(false);
          setNewComment({ body: '', postId: null, userId: 1 });
        },
        onError: (error) => {
          console.error('댓글 추가 오류:', error);
        },
      });
    } catch (error) {
      console.error('mutation 실행 중 오류:', error);
    }
  };

  // 댓글 수정
  const handleUpdateComment = async () => {
    if (!selectedComment || !selectedComment.body) return;

    try {
      updateCommentMutation.mutate(
        { id: selectedComment.id, body: selectedComment.body },
        {
          onSuccess: () => {
            setShowEditCommentDialog(false);
            setSelectedComment(null);
          },
          onError: (error) => {
            console.error('댓글 수정 오류:', error);
          },
        },
      );
    } catch (error) {
      console.error('mutation 실행 중 오류:', error);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (id: number) => {
    try {
      deleteCommentMutation.mutate(id, {
        onError: (error) => {
          console.error('댓글 삭제 오류:', error);
        },
      });
    } catch (error) {
      console.error('mutation 실행 중 오류:', error);
    }
  };

  // 댓글 좋아요
  const handleLikeComment = async (id: number) => {
    try {
      likeCommentMutation.mutate(
        { id, likes: 1 }, // 기본값 1로 설정
        {
          onError: (error) => {
            console.error('댓글 좋아요 오류:', error);
          },
        },
      );
    } catch (error) {
      console.error('mutation 실행 중 오류:', error);
    }
  };

  return {
    // 상태 (클라이언트 상태만 반환)
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    // 상태 설정자
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    // 함수들
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    // 유틸리티 함수들
    clearNewComment,
    clearSelectedComment,
  };
};
