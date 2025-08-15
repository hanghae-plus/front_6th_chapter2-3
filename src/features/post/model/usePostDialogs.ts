import { useAtom } from "jotai"
import {
  showAddDialogAtom,
  showAddCommentDialogAtom,
  showEditCommentDialogAtom,
  showUserModalAtom,
  newPostAtom,
  newCommentAtom,
  selectedUserAtom,
  selectedCommentAtom,
} from "../../../store/postsAtoms"
import { User, Comment } from "../../../types"

export const usePostDialogs = () => {
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom)

  const [newPost, setNewPost] = useAtom(newPostAtom)
  const [newComment, setNewComment] = useAtom(newCommentAtom)
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom)
  const [, setSelectedComment] = useAtom(selectedCommentAtom)

  const openAddDialog = () => setShowAddDialog(true)
  const closeAddDialog = () => setShowAddDialog(false)

  const openAddCommentDialog = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  const closeAddCommentDialog = () => setShowAddCommentDialog(false)

  const openEditCommentDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  const closeEditCommentDialog = () => setShowEditCommentDialog(false)

  const openUserModal = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  const closeUserModal = () => setShowUserModal(false)

  const resetNewPost = () => setNewPost({ title: "", body: "", userId: 1 })
  const resetNewComment = () => setNewComment({ body: "", postId: null, userId: 1 })

  return {
    // 다이얼로그 상태
    showAddDialog,
    showAddCommentDialog,
    showEditCommentDialog,
    showUserModal,

    // 폼 데이터
    newPost,
    setNewPost,
    newComment,
    setNewComment,
    selectedUser,

    // 다이얼로그 제어
    openAddDialog,
    closeAddDialog,
    openAddCommentDialog,
    closeAddCommentDialog,
    openEditCommentDialog,
    closeEditCommentDialog,
    openUserModal,
    closeUserModal,

    // 리셋 함수
    resetNewPost,
    resetNewComment,
  }
}
