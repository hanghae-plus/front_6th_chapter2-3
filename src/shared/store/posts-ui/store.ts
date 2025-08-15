import { create } from 'zustand'
import { IPostsUIState } from './type'

export const usePostsUIStore = create<IPostsUIState>((set) => ({
  // 초기 상태 - ID만 저장
  selectedPostId: null,
  selectedCommentId: null,
  selectedUserId: null,

  showAddDialog: false,
  showEditDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showPostDetailDialog: false,
  showUserModal: false,

  // 선택된 아이템 설정 - ID 기반
  setSelectedPostId: (id) => set({ selectedPostId: id }),
  setSelectedCommentId: (id) => set({ selectedCommentId: id }),
  setSelectedUserId: (id) => set({ selectedUserId: id }),

  // 모달 상태 설정
  setShowAddDialog: (show) => set({ showAddDialog: show }),
  setShowEditDialog: (show) => set({ showEditDialog: show }),
  setShowAddCommentDialog: (show) => set({ showAddCommentDialog: show }),
  setShowEditCommentDialog: (show) => set({ showEditCommentDialog: show }),
  setShowPostDetailDialog: (show) => set({ showPostDetailDialog: show }),
  setShowUserModal: (show) => set({ showUserModal: show }),

  // 복합 액션들 - ID 기반
  openPostDetail: (postId) =>
    set({
      selectedPostId: postId,
      showPostDetailDialog: true,
    }),

  openPostEdit: (postId) =>
    set({
      selectedPostId: postId,
      showEditDialog: true,
    }),

  openCommentAdd: (postId) =>
    set({
      selectedPostId: postId, // 댓글을 추가할 게시물 ID 저장
      showAddCommentDialog: true,
    }),

  openCommentEdit: (commentId) =>
    set({
      selectedCommentId: commentId,
      showEditCommentDialog: true,
    }),

  openUserModal: (userId) =>
    set({
      selectedUserId: userId,
      showUserModal: true,
    }),

  closeAllDialogs: () =>
    set({
      showAddDialog: false,
      showEditDialog: false,
      showAddCommentDialog: false,
      showEditCommentDialog: false,
      showPostDetailDialog: false,
      showUserModal: false,
      selectedPostId: null,
      selectedCommentId: null,
      selectedUserId: null,
    }),
}))
