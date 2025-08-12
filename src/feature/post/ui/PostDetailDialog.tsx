import React from "react"
import { Dialog, HighlightText } from "../../../shared/ui"
import { Comments as CommentItems, NewComment } from "../../comment"
import { Post } from "../type"
import { Comment } from "../../../entities"

export const PostDetailDialog = ({
  showPostDetailDialog,
  setShowPostDetailDialog,
  selectedPost,
  postId,
  searchQuery,
  setNewComment,
  setShowAddCommentDialog,
  comments,
  setComments,
  setSelectedComment,
  setShowEditCommentDialog,
}: {
  showPostDetailDialog: boolean
  setShowPostDetailDialog: React.Dispatch<React.SetStateAction<boolean>>
  selectedPost: Post
  searchQuery: string
  postId: number
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>
  setShowAddCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
  comments: {
    [key: number]: Comment[]
  }
  setSelectedComment: React.Dispatch<React.SetStateAction<Comment | null>>
  setShowEditCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
  setComments: React.Dispatch<
    React.SetStateAction<{
      [key: number]: Comment[]
    }>
  >
}) => {
  const commentsProps = {
    postId,
    searchQuery,
    setNewComment,
    setShowAddCommentDialog,
    comments: comments as {
      [key: number]: Comment[]
    },
    setComments,
    setSelectedComment,
    setShowEditCommentDialog,
  }

  return (
    <Dialog
      open={showPostDetailDialog}
      handleChange={setShowPostDetailDialog}
      title={HighlightText(selectedPost?.title, searchQuery) ?? ""}
    >
      <div className="space-y-4">
        <p>{HighlightText(selectedPost?.body, searchQuery)}</p>
        <CommentItems {...commentsProps} />
      </div>
    </Dialog>
  )
}
