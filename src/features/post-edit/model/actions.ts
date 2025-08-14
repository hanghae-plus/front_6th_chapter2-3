import { FormEvent } from "react"
import { useAtom } from "jotai"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePost } from "../../../entities/post/api"
import { editablePostAtom, showEditPostDialogAtom } from "./atoms"
import type { Post } from "../../../entities/post/model"
import { useAtomValue } from "jotai"
import { localCreatedPostIdsAtom } from "../../../shared/lib/localAtoms"

export const usePostEdit = () => {
  const [editablePost, setEditablePost] = useAtom(editablePostAtom)
  const [showDialog, setShowDialog] = useAtom(showEditPostDialogAtom)
  const queryClient = useQueryClient()
  const localCreatedIds = useAtomValue(localCreatedPostIdsAtom)

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, postData }: { postId: number; postData: { title: string; body: string } }) =>
      localCreatedIds.has(postId) ? Promise.resolve({} as any) : updatePost(postId, postData),
    onMutate: async ({ postId, postData }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      const previous = queryClient.getQueriesData({ queryKey: ["posts"] })
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        return {
          ...old,
          posts: old.posts.map((p: Post) => (p.id === postId ? { ...p, ...postData } : p)),
        }
      })
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) for (const [k, d] of ctx.previous) queryClient.setQueryData(k as any, d as any)
    },
    onSuccess: () => {
      setShowDialog(false)
    },
    onSettled: () => {},
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editablePost?.id) return
    try {
      await updatePostMutation.mutateAsync({
        postId: editablePost.id,
        postData: {
          title: editablePost.title,
          body: editablePost.body,
        },
      })
    } catch (error) {
      console.error("Failed to update post:", error)
    }
  }

  const openEditDialog = (post: Post) => {
    setEditablePost(post)
    setShowDialog(true)
  }

  const closeDialog = () => setShowDialog(false)

  return {
    editablePost,
    setEditablePost,
    showDialog,
    handleSubmit,
    openEditDialog,
    closeDialog,
  }
}
