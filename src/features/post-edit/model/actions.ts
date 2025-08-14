import { FormEvent } from "react"
import { useAtom } from "jotai"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePost } from "../../../entities/post/api"
import { editablePostAtom, showEditPostDialogAtom } from "./atoms"
import type { Post, PostsApiResponse } from "../../../entities/post/model"
import { useAtomValue } from "jotai"
import { localCreatedPostIdsAtom } from "../../../shared/lib/localAtoms"
import { postsKey } from "../../../shared/api/queryKeys"
import { applyUpdateByIdOrClient } from "../../../entities/post/model/adapters"
import { ENV_USE_SERVER_TRUTH } from "../../../shared/lib/env"

type UsePostEditOptions = {
  onNotify?: (message: string) => void
}

export const usePostEdit = (options: UsePostEditOptions = {}) => {
  const [editablePost, setEditablePost] = useAtom(editablePostAtom)
  const [showDialog, setShowDialog] = useAtom(showEditPostDialogAtom)
  const queryClient = useQueryClient()
  const localCreatedIds = useAtomValue(localCreatedPostIdsAtom)

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, postData }: { postId: number; postData: { title: string; body: string } }) =>
      localCreatedIds.has(postId) ? Promise.resolve({} as unknown as Post) : updatePost(postId, postData),
    onMutate: async ({ postId, postData }) => {
      await queryClient.cancelQueries({ queryKey: postsKey.all })
      const previous = queryClient.getQueriesData({ queryKey: postsKey.all }) as Array<
        [readonly ["posts"], PostsApiResponse | undefined]
      >
      queryClient.setQueriesData({ queryKey: postsKey.all }, (old: PostsApiResponse | undefined) => {
        if (!old) return old
        return applyUpdateByIdOrClient(old, postId, undefined, (p) => ({ ...p, ...postData }))
      })
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) for (const [k, d] of ctx.previous) queryClient.setQueryData(k, d)
    },
    onSuccess: () => {
      setShowDialog(false)
      options.onNotify?.("게시물이 수정되었습니다")
    },
    onSettled: () => {
      if (ENV_USE_SERVER_TRUTH) {
        queryClient.invalidateQueries({ queryKey: postsKey.all })
      }
    },
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
