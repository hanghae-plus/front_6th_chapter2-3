import { useState } from "react"
import { PostItem } from "../../../entities/post/model"
import { useModal } from "../../open-modal/useModal"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePost } from "../../../entities/post/api"
import { useFetchPostsModeStore } from "../fetch-posts-by-mode/fetchMode.store"
import { ListResponse } from "../../../shared/types/types"

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null)
  const modal = useModal("editPost")

  // 포스트 모드 상태
  const { state } = useFetchPostsModeStore()

  // 쿼리키 생성
  const queryKey = ["postsView", ...Object.values(state)]

  /**
   * 포스트 업데이트 뮤테이션
   */
  const updatePostMutation = useMutation({
    mutationFn: (post: PostItem) => {
      const { userId, body, title, id } = post
      return updatePost({ id, title, body: body || "", userId: userId || 1 })
    },
    onMutate: () => {
      const previousPosts = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: ListResponse<"posts", PostItem>) => ({
        ...old,
        posts: old.posts.map((post) => (post.id === selectedPost?.id ? selectedPost : post)),
      }))
      return { previousPosts }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previousPosts !== undefined) {
        queryClient.setQueryData(queryKey, ctx.previousPosts) // ← 이전값 그대로 복원
      }
    },
    onSettled: () => {
      modal.close()
    },
  })

  /**
   * 포스트 변경 핸들러
   * @param key 키 (title, body, userId)
   * @param value 값 (string, string, number)
   */
  const handleChangePost = (key: string, value: string | number) => {
    if (selectedPost) {
      setSelectedPost({ ...selectedPost, [key]: value })
    }
  }

  /**
   * 포스트 클릭 핸들러
   * @param post 포스트 아이템
   */
  const handleClickEditPost = (post: PostItem) => {
    setSelectedPost(post)
    modal.open()
  }

  return {
    state: {
      selectedPost,
    },
    action: {
      update: updatePostMutation.mutate,
      edit: handleClickEditPost,
      change: handleChangePost,
      reset: () => setSelectedPost(null),
    },
    modal,
  }
}
