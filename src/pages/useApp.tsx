import { atom, useAtom } from "jotai"
import type { Post } from "../entities/Post/Post"
import type { Comment } from "../entities/Comment/Comment"

const showAddDialogAtom = atom(false)
const showEditDialogAtom = atom(false)
const selectedPostAtom = atom<Post | null>(null)
const selectedCommentAtom = atom<Comment | null>(null)
const newCommentAtom = atom({ body: "", postId: null, userId: 1 })

const showAddCommentDialogAtom = atom(false)
const showEditCommentDialogAtom = atom(false)
const showPostDetailDialogAtom = atom(false)
const showUserModalAtom = atom(false)

export function useApp() {
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const [newComment, setNewComment] = useAtom(newCommentAtom)

  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom)

  return {
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    selectedPost,
    setSelectedPost,
    selectedComment,
    setSelectedComment,
    newComment,
    setNewComment,
    showAddCommentDialog,
    setShowAddCommentDialog,
    showEditCommentDialog,
    setShowEditCommentDialog,
    showPostDetailDialog,
    setShowPostDetailDialog,
    showUserModal,
    setShowUserModal,
  }
}
