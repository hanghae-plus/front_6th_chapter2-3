import { useState } from "react"
import { CreatePostRequest } from "../../entities/post/model/types"
import { CreateCommentRequest, Comment } from "../../entities/comment/model/types"

// 게시물 관리 UI 상태 관리
export const usePostsUI = () => {
  // 게시물 UI 상태
  const [showAddPostDialog, setShowAddPostDialog] = useState(false)
  const [showEditPostDialog, setShowEditPostDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  
  // 댓글 UI 상태
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  
  // 사용자 UI 상태
  const [showUserModal, setShowUserModal] = useState(false)
  
  // 검색 UI 상태
  const [searchQuery, setSearchQuery] = useState("")
  
  // 필터 UI 상태
  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  
  // 폼 데이터
  const [newPost, setNewPost] = useState<CreatePostRequest>({
    title: "",
    body: "",
    userId: 1,
  })
  
  const [newComment, setNewComment] = useState<CreateCommentRequest>({
    body: "",
    postId: null,
    userId: 1,
  })
  
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  // UI 액션
  const openAddPostDialog = () => setShowAddPostDialog(true)
  const closeAddPostDialog = () => {
    setShowAddPostDialog(false)
    setNewPost({ title: "", body: "", userId: 1 })
  }

  const openEditPostDialog = () => setShowEditPostDialog(true)
  const closeEditPostDialog = () => setShowEditPostDialog(false)

  const openPostDetailDialog = () => setShowPostDetailDialog(true)
  const closePostDetailDialog = () => setShowPostDetailDialog(false)

  const openAddCommentDialog = (postId: number) => {
    setNewComment((prev: CreateCommentRequest) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }
  const closeAddCommentDialog = () => {
    setShowAddCommentDialog(false)
    setNewComment({ body: "", postId: null, userId: 1 })
  }

  const openEditCommentDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }
  const closeEditCommentDialog = () => {
    setShowEditCommentDialog(false)
    setSelectedComment(null)
  }

  const openUserModal = () => setShowUserModal(true)
  const closeUserModal = () => setShowUserModal(false)

  return {
    // 게시물 UI 상태
    showAddPostDialog,
    showEditPostDialog,
    showPostDetailDialog,
    setShowAddPostDialog,
    setShowEditPostDialog,
    setShowPostDetailDialog,
    openAddPostDialog,
    closeAddPostDialog,
    openEditPostDialog,
    closeEditPostDialog,
    openPostDetailDialog,
    closePostDetailDialog,
    
    // 댓글 UI 상태
    showAddCommentDialog,
    showEditCommentDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    openAddCommentDialog,
    closeAddCommentDialog,
    openEditCommentDialog,
    closeEditCommentDialog,
    
    // 사용자 UI 상태
    showUserModal,
    setShowUserModal,
    openUserModal,
    closeUserModal,
    
    // 검색 UI 상태
    searchQuery,
    setSearchQuery,
    
    // 필터 UI 상태
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    
    // 폼 데이터
    newPost,
    setNewPost,
    newComment,
    setNewComment,
    selectedComment,
    setSelectedComment,
  }
}
