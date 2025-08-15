export interface IPostsUIState {
  // 선택된 아이템들 (ID만 저장)
  selectedPostId: number | null
  selectedCommentId: number | null
  selectedUserId: number | null

  // 모달 상태들
  showAddDialog: boolean
  showEditDialog: boolean
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  showPostDetailDialog: boolean
  showUserModal: boolean

  // Actions - ID 기반으로 변경
  setSelectedPostId: (id: number | null) => void
  setSelectedCommentId: (id: number | null) => void
  setSelectedUserId: (id: number | null) => void

  setShowAddDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void
  setShowAddCommentDialog: (show: boolean) => void
  setShowEditCommentDialog: (show: boolean) => void
  setShowPostDetailDialog: (show: boolean) => void
  setShowUserModal: (show: boolean) => void

  // 복합 액션들 - ID 기반으로 변경
  openPostDetail: (postId: number) => void
  openPostEdit: (postId: number) => void
  openCommentAdd: (postId: number) => void
  openCommentEdit: (commentId: number) => void
  openUserModal: (userId: number) => void

  closeAllDialogs: () => void
}
