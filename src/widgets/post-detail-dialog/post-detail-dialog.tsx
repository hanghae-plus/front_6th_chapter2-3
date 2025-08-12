/* eslint-disable react-refresh/only-export-components */
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import {
  addComment as addCommentAction,
  commentEntityQueries,
  updateComment as updateCommentAction,
} from "@/entities/comments"
import type { Post } from "@/entities/posts"
import { openAddCommentDialog } from "@/features/add-comment/ui"
import { openUpdateCommentDialog } from "@/features/update-comment"

import { useMutation, useQuery } from "@tanstack/react-query"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { overlay } from "overlay-kit"

type Props = {
  post: Post
  onDeleteComment: (commentId: number) => void
  onLikeComment: (commentId: number, likes: number) => void
  searchQuery: string
}

export const PostDetailDialog = ({ post, onDeleteComment, onLikeComment, searchQuery }: Props) => {
  const { data: comments } = useQuery({
    ...commentEntityQueries.getCommentsByPostId(post.id),
    select: (response) => response.comments,
  })

  const addComment = useMutation({
    mutationFn: addCommentAction,
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    },
  })

  const updateComment = useMutation({
    mutationFn: updateCommentAction,
    onError: (error) => console.error("댓글 수정 오류:", error),
  })

  const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>
          <HighlightText text={post?.title ?? ""} highlight={searchQuery} />
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p>
          <HighlightText text={post?.body ?? ""} highlight={searchQuery} />
        </p>

        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">댓글</h3>
            <Button
              size="sm"
              onClick={() =>
                openAddCommentDialog({
                  onSubmit: (formData) => addComment.mutateAsync(formData),
                })
              }
            >
              <Plus className="w-3 h-3 mr-1" />
              댓글 추가
            </Button>
          </div>
          <div className="space-y-1">
            {comments?.map((comment) => (
              <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <span className="font-medium truncate">{comment.user.username}:</span>
                  <span className="truncate">
                    <HighlightText text={comment.body} highlight={searchQuery} />
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const targetComment = comments?.find((targetComment) => targetComment.id === comment.id)
                      onLikeComment(comment.id, (targetComment?.likes ?? 0) + 1)
                    }}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="ml-1 text-xs">{comment.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      openUpdateCommentDialog({
                        comment: { body: comment.body, postId: comment.postId, userId: comment.user.id },
                        onSubmit: (formValues) => updateComment.mutate({ id: comment.id, body: formValues.body }),
                      })
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export const openPostDetailDialog = (options: Omit<Props, "close">) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => !!isOpen && close()}>
      <PostDetailDialog
        post={options.post}
        onDeleteComment={options.onDeleteComment}
        onLikeComment={options.onLikeComment}
        searchQuery={options.searchQuery}
      />
    </Dialog>
  ))
}
