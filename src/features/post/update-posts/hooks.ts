import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PostItem, UpdatePost } from "../../../entities/post/model/types"
import PostAPI from "../../../entities/post/api/PostAPI"
import { useState } from "react"

export const useUpdatePost = (post: PostItem, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  const initialPost = {
    id: post.id,
    title: post.title,
    body: post.body,
  }

  const [editPost, setEditPost] = useState<Partial<UpdatePost>>(initialPost)

  const mutation = useMutation({
    mutationFn: (post: Partial<UpdatePost>) => PostAPI.updatePost(post.id || 0, post),

    onSuccess: (updatedPost) => {
      queryClient.setQueryData<PostItem[] | undefined>(["posts"], (prev) => {
        if (!prev) return prev
        return prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      })
      onSuccess?.()
    },
    onError: (error) => {
      console.error("게시물 업데이트 오류:", error)
    },
  })

  const setTitle = (title: string) => setEditPost((prev) => ({ ...prev, title }))
  const setBody = (body: string) => setEditPost((prev) => ({ ...prev, body }))

  const updatePost = () => {
    mutation.mutate(editPost)
  }

  return { editPost, setTitle, setBody, updatePost }
}
