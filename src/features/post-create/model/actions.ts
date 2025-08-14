import { FormEvent } from "react"
import { useAtom } from "jotai"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addPost } from "../../../entities/post/api"
import { newPostDataAtom, showAddPostDialogAtom } from "./atoms"
import type { PostsApiResponse, Post } from "../../../entities/post/model"
import { useAtomValue, useSetAtom } from "jotai"
import { localCreatedPostIdsAtom } from "../../../shared/lib/localAtoms"
import { listSortOrderAtom } from "../../../shared/lib/viewAtoms"

export const usePostCreate = () => {
  const [newPostData, setNewPostData] = useAtom(newPostDataAtom)
  const setLocalCreated = useSetAtom(localCreatedPostIdsAtom)
  const sortOrder = useAtomValue(listSortOrderAtom)
  const [showDialog, setShowDialog] = useAtom(showAddPostDialogAtom)
  const queryClient = useQueryClient()

  const addPostMutation = useMutation({
    mutationFn: addPost,
    onError: () => {},
    onSuccess: (created) => {
      // 서버가 되돌려준 데이터에 reactions 등 누락 필드 보정
      const createdNormalized: Post = {
        ...created,
        tags: created.tags ?? [],
        reactions: created.reactions ?? { likes: 0, dislikes: 0 },
        // 클라이언트 전용 고유 ID 부여(서버 id 중복 이슈 방지)
        clientId: `${created.id}-${Date.now()}`,
      }
      setLocalCreated((prev) => {
        const next = new Set<number>(prev)
        next.add(createdNormalized.id)
        return next
      })
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        const data = old as PostsApiResponse | undefined
        if (!data) return old
        // asc: 마지막 페이지 끝에만 추가되도록 현재 페이지 데이터에서는 제거
        const posts = sortOrder === "desc" ? [createdNormalized, ...data.posts] : [...data.posts] // asc는 현재 페이지에는 추가하지 않음(마지막 페이지에만 나타나야 함)
        return { ...data, posts, total: (data.total ?? 0) + 1 }
      })
    },
    onSettled: () => {
      setShowDialog(false)
      setNewPostData({ title: "", body: "", userId: 1 })
    },
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await addPostMutation.mutateAsync(newPostData)
    } catch (error) {
      console.error("Failed to add post:", error)
    }
  }

  const openDialog = () => setShowDialog(true)
  const closeDialog = () => setShowDialog(false)

  return {
    newPostData,
    setNewPostData,
    showDialog,
    isSubmitting: addPostMutation.isPending,
    handleSubmit,
    openDialog,
    closeDialog,
  }
}
