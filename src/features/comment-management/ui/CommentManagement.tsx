import { useState } from "react"

import {
  useAddComment,
  useDeleteComment,
  useGetComments,
  useLikeComment,
  useUpdateComment,
} from "@/features/comment-management/hooks/useComment"
import { AddComment, Comment, UpdateComment } from "@/features/comment-management/types"
import { CommentDialogs } from "@/features/comment-management/ui/CommentDialogs"
import { CommentList } from "@/features/comment-management/ui/CommentList"

interface CommentManagementProps {
  postId?: number
  searchTerm?: string
}

export function CommentManagement({ postId, searchTerm }: CommentManagementProps) {
  const [selectedComment, setSelectedComment] = useState<UpdateComment | null>(null)
  const [newComment, setNewComment] = useState<AddComment | null>(null)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

  const { data: commentsList } = useGetComments(postId)
  const { mutate: addComment } = useAddComment()
  const { mutate: updateComment } = useUpdateComment()
  const { mutate: deleteComment } = useDeleteComment()
  const { mutate: likeComment } = useLikeComment()

  const handleAddComment = () => {
    if (!newComment) return
    addComment(newComment, {
      onSuccess: () => {
        setShowAddCommentDialog(false)
        setNewComment(null)
      },
    })
  }

  const handleUpdateComment = () => {
    if (!selectedComment) return
    updateComment(selectedComment, {
      onSuccess: () => {
        setShowEditCommentDialog(false)
      },
    })
  }

  const handleDeleteComment = (id: number, postId: number) => {
    deleteComment(
      { id, postId },
      {
        onSuccess: () => {
          setShowEditCommentDialog(false)
        },
      },
    )
  }

  const handleLikeComment = (id: number, postId: number, currentLikes: number) => {
    likeComment(
      { id, currentLikes, postId },
      {
        onSuccess: () => {
          setShowEditCommentDialog(false)
        },
      },
    )
  }

  const handleAddCommentClick = (postId: number) => {
    setNewComment({ body: "", postId, userId: 1 })
    setShowAddCommentDialog(true)
  }

  const handleEditCommentClick = (comment: Comment) => {
    setSelectedComment({
      id: comment.id,
      body: comment.body,
      likes: comment.likes,
      postId: comment.postId,
    })
    setShowEditCommentDialog(true)
  }

  if (!postId) return null

  return (
    <>
      <CommentList
        comments={commentsList?.comments}
        onAddComment={handleAddCommentClick}
        onDeleteComment={handleDeleteComment}
        onEditComment={handleEditCommentClick}
        onLikeComment={handleLikeComment}
        postId={postId}
        searchTerm={searchTerm}
      />

      <CommentDialogs
        newComment={newComment}
        onAddComment={handleAddComment}
        onAddDialogChange={setShowAddCommentDialog}
        onEditDialogChange={setShowEditCommentDialog}
        onNewCommentChange={setNewComment}
        onSelectedCommentChange={setSelectedComment}
        onUpdateComment={handleUpdateComment}
        selectedComment={selectedComment}
        showAddDialog={showAddCommentDialog}
        showEditDialog={showEditCommentDialog}
      />
    </>
  )
}
