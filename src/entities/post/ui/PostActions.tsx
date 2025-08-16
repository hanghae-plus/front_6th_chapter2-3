import { Edit2, MessageSquare, Trash2 } from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

import { DialogType, mergeClasses, useDialogStore } from "@/base/lib"
import { Button } from "@/base/ui/Button"
import type { Post } from "@/entities/post/model"
import { useDeletePostMutation } from "@/features/delete-post/api"
import { usePostDialogStore } from "@/features/get-post/model"

type PostActionsProps = ComponentPropsWithoutRef<"div"> & {
  post: Post
}

export function PostActions({ post, className, ...rest }: PostActionsProps) {
  const { openDialog } = useDialogStore((state) => state.actions)
  const { setSelectedPost } = usePostDialogStore((state) => state.actions)

  const deletePostMutation = useDeletePostMutation()

  const handleDetailClick = () => {
    setSelectedPost(post)
    openDialog(DialogType.POST_DETAIL)
  }

  const handleEditClick = () => {
    setSelectedPost(post)
    openDialog(DialogType.EDIT_POST)
  }

  const handleDeleteClick = async () => {
    await deletePostMutation.mutateAsync({ id: post.id })
  }

  return (
    <div className={mergeClasses("flex items-center gap-2", className)} {...rest}>
      <Button variant="ghost" size="sm" onClick={handleDetailClick}>
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleEditClick}>
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDeleteClick}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
