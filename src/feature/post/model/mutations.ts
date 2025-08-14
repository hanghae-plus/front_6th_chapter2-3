import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Post as OriginPost } from "../../../entities"
import { NewPost, Post, DeletePost } from "../../../feature/post/type"
import { useSelectedPostStore } from "../../../feature/post/model/store"
import { requestApi } from "../../../shared/lib"

export const useAddPostMutation = () => {
  const queryClient = useQueryClient()
  const { setShowAddDialog } = useSelectedPostStore()

  return useMutation({
    mutationFn: async (newPost: NewPost) => {
      const { result, data } = await requestApi<OriginPost>(`/api/posts/add`, {
        method: "POST",
        body: newPost,
      })

      if (!result || !data) {
        throw new Error("게시물 추가에 실패했습니다")
      }

      return data
    },
    onMutate: async (newPost) => {
      // 관련 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: ["getPosts"] })
      await queryClient.cancelQueries({ queryKey: ["getSeachPosts"] })
      await queryClient.cancelQueries({ queryKey: ["getPostsByTag"] })

      // 이전 데이터 저장
      const previousPosts = queryClient.getQueryData(["getPosts"])

      // 낙관적 업데이트: 임시 게시물 추가
      const optimisticPost: Post = {
        id: Date.now(), // 임시 ID
        title: newPost.title,
        body: newPost.body,
        userId: newPost.userId,
        reactions: { likes: 0, dislikes: 0 },
        tags: [],
        views: 0,
        author: {
          id: newPost.userId,
          username: "You",
          image: "/default-avatar.png",
        },
      }

      // 캐시에 즉시 추가 (맨 앞에)
      queryClient.setQueryData(["getPosts"], (old: any) => {
        if (!old) return { posts: [optimisticPost], total: 1 }
        return {
          ...old,
          posts: [optimisticPost, ...old.posts],
          total: old.total + 1,
        }
      })

      return { previousPosts, optimisticPost }
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context && context.previousPosts) {
        queryClient.setQueryData(["getPosts"], context.previousPosts)
      }
      console.error("게시물 추가 오류:", error)
    },
    onSuccess: (data, variables, context) => {
      // 서버 응답으로 최종 업데이트 (임시 게시물을 실제 데이터로 교체)
      const realPost: Post = {
        ...data,
        reactions: { likes: 0, dislikes: 0 },
        tags: [],
        views: 0,
        author: {
          id: data.userId,
          username: "You",
          image: "/default-avatar.png",
        },
      }

      queryClient.setQueryData(["getPosts"], (old: any) => {
        if (!old) return { posts: [realPost], total: 1 }
        return {
          ...old,
          posts: old.posts.map((post: Post) => (post.id === context?.optimisticPost.id ? realPost : post)),
        }
      })

      // 성공 시 다이얼로그 닫기
      setShowAddDialog(false)
    },
    onSettled: () => {
      // 모든 게시물 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["getPosts"] })
      queryClient.invalidateQueries({ queryKey: ["getSeachPosts"] })
      queryClient.invalidateQueries({ queryKey: ["getPostsByTag"] })
    },
  })
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()
  const { setShowEditDialog } = useSelectedPostStore()

  return useMutation({
    mutationFn: async (updatedPost: Post) => {
      const { result, data } = await requestApi<OriginPost>(`/api/posts/${updatedPost.id}`, {
        method: "PUT",
        body: {
          title: updatedPost.title,
          body: updatedPost.body,
          userId: updatedPost.userId,
        },
      })

      if (!result || !data) {
        throw new Error("게시물 수정에 실패했습니다")
      }

      return data
    },
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({ queryKey: ["getPosts"] })
      await queryClient.cancelQueries({ queryKey: ["getSeachPosts"] })
      await queryClient.cancelQueries({ queryKey: ["getPostsByTag"] })

      const previousPosts = queryClient.getQueryData(["getPosts"])

      // 낙관적 업데이트: 즉시 UI에 수정된 게시물 반영
      queryClient.setQueryData(["getPosts"], (old: any) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.map((post: Post) =>
            post.id === updatedPost.id
              ? {
                  ...post,
                  title: updatedPost.title,
                  body: updatedPost.body,
                }
              : post,
          ),
        }
      })

      return { previousPosts, updatedPostId: updatedPost.id }
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context && context.previousPosts) {
        queryClient.setQueryData(["getPosts"], context.previousPosts)
      }
      console.error("게시물 수정 오류:", error)
    },
    onSuccess: (data, variables) => {
      // 서버 응답으로 최종 업데이트
      const updatedPostWithAuthor: Post = {
        ...data,
        reactions: variables.reactions || { likes: 0, dislikes: 0 },
        tags: variables.tags || [],
        views: variables.views || 0,
        author: variables.author,
      }

      queryClient.setQueryData(["getPosts"], (old: any) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.map((post: Post) => (post.id === data.id ? updatedPostWithAuthor : post)),
        }
      })

      // 성공 시 다이얼로그 닫기
      setShowEditDialog(false)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] })
      queryClient.invalidateQueries({ queryKey: ["getSeachPosts"] })
      queryClient.invalidateQueries({ queryKey: ["getPostsByTag"] })
    },
  })
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: number) => {
      const { result, data } = await requestApi<DeletePost>(`/api/posts/${postId}`, {
        method: "DELETE",
      })

      if (!result) {
        throw new Error("게시물 삭제에 실패했습니다")
      }

      return { deletedId: postId, data }
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["getPosts"] })
      await queryClient.cancelQueries({ queryKey: ["getSeachPosts"] })
      await queryClient.cancelQueries({ queryKey: ["getPostsByTag"] })

      const previousPosts = queryClient.getQueryData(["getPosts"])

      // 낙관적 업데이트: 즉시 UI에서 게시물 제거
      queryClient.setQueryData(["getPosts"], (old: any) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.filter((post: Post) => post.id !== postId),
          total: old.total - 1,
        }
      })

      return { previousPosts, postId }
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백 (삭제된 게시물 복원)
      if (context && context.previousPosts) {
        queryClient.setQueryData(["getPosts"], context.previousPosts)
      }
      console.error("게시물 삭제 오류:", error)
    },
    onSuccess: (result) => {
      console.log(`게시물 ${result.deletedId} 삭제 완료`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] })
      queryClient.invalidateQueries({ queryKey: ["getSeachPosts"] })
      queryClient.invalidateQueries({ queryKey: ["getPostsByTag"] })
    },
  })
}
