import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFetchPostsModeStore } from "../fetch-posts-by-mode/store/fetchMode.store"
import { addPost } from "../../../entities/post/api"
import { ListResponse } from "../../../shared/types/types"
import { PostItem } from "../../../entities/post/model"
import { useModal } from "../../open-modal/useModal"
import { tempIdGenerator } from "../../../shared/utils/tempIdGenerator"

const initialNewPost = { title: "", body: "", userId: 1 }

export const useAddPost = () => {
  const queryClient = useQueryClient()
  const modal = useModal("addPost")

  // 새로운 게시물 상태
  const [newPost, setNewPost] = useState(initialNewPost)

  // 포스트 모드 상태
  const { state } = useFetchPostsModeStore()

  // 쿼리키 생성
  const queryKey = ["postsView", ...Object.values(state)]

  /**
   * 게시물 추가 뮤테이션
   */
  const addPostMutation = useMutation({
    mutationFn: addPost,
    onMutate: async (newPost) => {
      const tempId = tempIdGenerator()
      const tempPost = { ...newPost, id: tempId }
      await queryClient.cancelQueries({ queryKey })
      const previousPosts = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: ListResponse<"posts", PostItem>) => ({
        ...old,
        posts: [tempPost, ...old.posts],
      }))

      return { previousPosts }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previousPosts !== undefined) {
        queryClient.setQueryData(queryKey, ctx.previousPosts)
      }
    },
    onSettled: () => {
      modal.close()
      setNewPost(initialNewPost)
    },
  })

  /**
   * 새로운 게시물 추가
   * @param key 키 (title, body, userId)
   * @param value 값 (string, string, number)
   */
  const updateNewPost = (key: string, value: string | number) => {
    setNewPost({ ...newPost, [key]: value })
  }

  return {
    state: {
      newPost,
    },
    actions: {
      add: addPostMutation.mutate,
      change: updateNewPost,
      reset: () => setNewPost(initialNewPost),
    },
    modal,
  }
}
