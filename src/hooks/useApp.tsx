import { atom, useAtom } from "jotai"
import type { Post } from "../entities/Post/Post"
import type { Comment } from "../entities/Comment/Comment"

const showPostAddDialogAtom = atom(false)
const showEditDialogAtom = atom(false)
const selectedPostAtom = atom<Post | null>(null)
const selectedCommentAtom = atom<Comment | null>(null)
const newCommentAtom = atom({ body: "", postId: null, userId: 1 })

const showAddCommentDialogAtom = atom(false)
const showEditCommentDialogAtom = atom(false)
const showPostViewDialogAtom = atom(false)
const showUserModalAtom = atom(false)

export function useApp() {
  const [showPostAddDialog, setShowPostAddDialog] = useAtom(showPostAddDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const [newComment, setNewComment] = useAtom(newCommentAtom)

  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const [showPostViewDialog, setShowPostViewDialog] = useAtom(showPostViewDialogAtom)
  const [showUserDialog, setShowUserDialog] = useAtom(showUserModalAtom)

  return {
    showPostAddDialog,
    setShowPostAddDialog,
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
    showPostViewDialog,
    setShowPostViewDialog,
    showUserDialog,
    setShowUserDialog,
  }
}
