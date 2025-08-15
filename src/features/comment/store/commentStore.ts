import { create } from 'zustand';
import { Comment, NewComment } from '../../../entities/comment';

interface CommentStore {
  // Phase 1: 기본 데이터 상태만 Zustand로 (기존 API 함수들과 호환)
  comments: Record<number, Comment[]>;
  selectedComment: Comment | null;
  newComment: NewComment;

  // Phase 2: UI 상태 Zustand로
  showAddCommentDialog: boolean;
  showEditCommentDialog: boolean;

  // 상태 설정자들 (기존 API 함수들과 호환)
  setComments: (comments: Record<number, Comment[]>) => void;
  setSelectedComment: (comment: Comment | null) => void;
  setNewComment: (comment: NewComment) => void;
  setShowAddCommentDialog: (show: boolean) => void;
  setShowEditCommentDialog: (show: boolean) => void;

  // 유틸리티 함수들
  clearNewComment: () => void;
  clearSelectedComment: () => void;
}

export const useCommentStore = create<CommentStore>((set, _get) => {
  return {
    // Phase 1: 기본 데이터 상태 (기존과 동일한 초기값)
    comments: {},
    selectedComment: null,
    newComment: { body: '', postId: null, userId: 1 }, // userId를 1로 명시적 설정

    // Phase 2: UI 상태 (기존과 동일한 초기값)
    showAddCommentDialog: false,
    showEditCommentDialog: false,

    // 상태 설정자들 (기존과 동일한 기능)
    setComments: (comments) => {
      if (typeof comments === 'function') {
        console.error('setComments에 함수가 전달됨!');
        return;
      }
      set({ comments });
    },
    setSelectedComment: (comment) => set({ selectedComment: comment }),
    setNewComment: (comment) => set({ newComment: comment }),
    setShowAddCommentDialog: (show) => set({ showAddCommentDialog: show }),
    setShowEditCommentDialog: (show) => set({ showEditCommentDialog: show }),

    // 유틸리티 함수들 (기존과 동일한 기능)
    clearNewComment: () => set({ newComment: { body: '', postId: null, userId: 1 } }), // userId를 1로 명시적 설정
    clearSelectedComment: () => set({ selectedComment: null }),
  };
});
