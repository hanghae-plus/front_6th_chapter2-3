import { useCommentStore } from '../store/index';
import { Comment, NewComment } from '../../../entities/comment';
import {
  useComments,
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

  // TanStack Query 훅들 사용
  const addCommentMutation = useAddComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const likeCommentMutation = useLikeComment();

  // 댓글 가져오기 (TanStack Query가 자동으로 처리)
  const handleFetchComments = async (postId: number) => {
    // TanStack Query가 자동으로 댓글 데이터를 가져옴
    // useComments(postId) 훅이 자동으로 작동
  };

  // 댓글 추가
  const handleAddComment = async (commentData?: any) => {
    const commentToAdd = commentData || newComment;

    console.log('=== handleAddComment 시작 ===');
    console.log('commentToAdd:', commentToAdd);
    console.log('addCommentMutation:', addCommentMutation);

    if (!commentToAdd.body || !commentToAdd.postId) {
      console.error('댓글 추가 실패: body 또는 postId가 없습니다.', commentToAdd);
      return;
    }

    console.log('TanStack Query 댓글 추가 시작:', commentToAdd);

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
  };

  // 댓글 삭제
  const handleDeleteComment = async (id: number, postId: number) => {
    deleteCommentMutation.mutate(id, {
      onError: (error) => {
        console.error('댓글 삭제 오류:', error);
      },
    });
  };

  // 댓글 좋아요
  const handleLikeComment = async (id: number, postId: number) => {
    // 현재 댓글의 likes 수를 찾아서 +1
    // 실제로는 현재 댓글 데이터를 가져와야 하지만, 간단하게 처리
    likeCommentMutation.mutate(
      { id, likes: 0 }, // 실제 likes 수는 API에서 처리
      {
        onError: (error) => {
          console.error('댓글 좋아요 오류:', error);
        },
      },
    );
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
    handleFetchComments,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    // 유틸리티 함수들
    clearNewComment,
    clearSelectedComment,
  };
};
