import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreatePost, PostItem, Post } from "../../../entities/post/model/types"
import PostAPI from "../../../entities/post/api/PostAPI"
import { useState } from "react"

const initialPost: CreatePost = {
  title: "",
  body: "",
  userId: 1,
}

export const useAddPost = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()
  const [newPost, setNewPost] = useState<CreatePost>(initialPost)

  const mutation = useMutation({
    mutationFn: (post: CreatePost) => PostAPI.createPost(post),
    onSuccess: (createdPost: PostItem) => {
      // 모든 posts 관련 쿼리를 찾아서 직접 업데이트
      const queries = queryClient.getQueriesData({ queryKey: ["posts"] })

      queries.forEach(([queryKey, data]) => {
        if (data && typeof data === "object" && "posts" in data) {
          const currentData = data as Post
          const updatedData: Post = {
            ...currentData,
            posts: [createdPost, ...currentData.posts],
            total: currentData.total + 1,
          }
          queryClient.setQueryData(queryKey, updatedData)
        }
      })

      // 성공 콜백 실행
      onSuccess?.()
      setNewPost(initialPost)
    },
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    },
  })

  const setTitle = (title: string) => setNewPost((prev) => ({ ...prev, title }))
  const setBody = (body: string) => setNewPost((prev) => ({ ...prev, body }))
  const setUserId = (userId: number) => setNewPost((prev) => ({ ...prev, userId }))

  const addPost = () => {
    if (newPost.title.trim() && newPost.body.trim()) {
      mutation.mutate(newPost)
    }
  }

  const resetForm = () => setNewPost(initialPost)

  return {
    newPost,
    setTitle,
    setBody,
    setUserId,
    addPost,
    resetForm,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
