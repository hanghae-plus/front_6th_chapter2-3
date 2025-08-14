import { FormEvent } from "react"
import { useAtom } from "jotai"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addPost } from "../../../entities/post/api"
import { newPostDataAtom, showAddPostDialogAtom } from "./atoms"
import type { PostsApiResponse, Post } from "../../../entities/post/model"
import { useAtomValue, useSetAtom } from "jotai"
import { localCreatedPostIdsAtom } from "../../../shared/lib/localAtoms"
import { listSortOrderAtom } from "../../../shared/lib/viewAtoms"
import { toastsAtom } from "../../../shared/lib/toastAtoms"
import { applyInsertTop } from "../../../entities/post/model/adapters"
import { postsKey } from "../../../shared/api/queryKeys"

type UsePostCreateOptions = {
  sortOrder?: "asc" | "desc"
  onNotify?: (message: string) => void
}

export const usePostCreate = (options: UsePostCreateOptions = {}) => {
  const [newPostData, setNewPostData] = useAtom(newPostDataAtom)
  const setLocalCreated = useSetAtom(localCreatedPostIdsAtom)
  const sortOrderFromAtom = useAtomValue(listSortOrderAtom)
  const [showDialog, setShowDialog] = useAtom(showAddPostDialogAtom)
  const setToasts = useSetAtom(toastsAtom)
  const queryClient = useQueryClient()
  const sortOrder = options.sortOrder ?? sortOrderFromAtom

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
      queryClient.setQueriesData({ queryKey: postsKey.all }, (old: PostsApiResponse | undefined) => {
        const data = old
        if (!data) return old
        if (sortOrder === "desc") {
          return applyInsertTop(data, createdNormalized)
        }
        // asc: 현재 페이지에는 추가하지 않음(마지막 페이지에서 나타남)
        return { ...data, posts: [...data.posts], total: (data.total ?? 0) + 1 }
      })

      if (sortOrder === "asc") {
        const id = `${Date.now()}`
        const notify = options.onNotify
        if (notify) {
          notify("새 게시물이 생성되었습니다 · 마지막 페이지에서 확인")
        } else {
          setToasts((prev) => [
            ...prev,
            {
              id,
              message: "새 게시물이 생성되었습니다 · 마지막 페이지에서 확인",
              type: "success",
              createdAt: Date.now(),
              durationMs: 3500,
            },
          ])
        }
      }
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
