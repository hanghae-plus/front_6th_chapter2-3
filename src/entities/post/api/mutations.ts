import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { QueryKey } from "@tanstack/react-query"
import { addPost, updatePost, deletePost } from "./index"
import type { Post, PostsApiResponse } from "../model/types"
import type { NewPost } from "../model/types"
import { updateQueriesWithRollback } from "@shared/lib"

const buildTempPost = (p: NewPost, nextId: number): Post => ({
  id: nextId,
  title: p.title,
  body: p.body,
  userId: p.userId,
  tags: [],
  reactions: { likes: 0, dislikes: 0 },
})

type PostsListQueryMeta = { limit?: number; skip?: number }

function isFirstPagePostsKey(key: QueryKey): boolean {
  if (!Array.isArray(key)) return false
  const [domain, type, meta] = key as [unknown, unknown, PostsListQueryMeta?]
  if (domain !== "posts" || type !== "list") return false
  const skip = typeof meta?.skip === "number" ? meta.skip : 0
  return skip === 0
}

// 게시물 생성
export const usePostPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addPost,
    onMutate: async (payload: NewPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      const pairs = queryClient.getQueriesData<PostsApiResponse>({ queryKey: ["posts", "list"] })
      
      // total 값을 기반으로 다음 ID 생성 (첫 번째 캐시 데이터만 사용)
      const firstData = pairs[0]?.[1]
      const nextId = firstData?.total ? firstData.total + 1 : 1
      
      const temp = buildTempPost(payload, nextId)
      const rollback = updateQueriesWithRollback(
        queryClient,
        pairs,
        (prev) => ({
          ...prev,
          posts: [temp, ...(prev.posts || [])],
          total: (prev.total || 0) + 1,
        }),
        ({ key }) => isFirstPagePostsKey(key),
      )
      return { rollback }
    },
    onError: (_err, _vars, ctx) => ctx?.rollback?.(),
    onSettled: () => {
      // 현재 화면(현재 페이지)에서 활성화된 쿼리만 재검증
      queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "active" })
    },
  })
}

// 게시물 수정
export const usePutPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, post }: { id: number; post: Partial<Post> }) => updatePost(id, post),
    onMutate: async ({ id, post }: { id: number; post: Partial<Post> }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      const pairs = queryClient.getQueriesData<PostsApiResponse>({ queryKey: ["posts"] })
      const rollback = updateQueriesWithRollback(queryClient, pairs, (prev) =>
        !prev?.posts
          ? prev
          : { ...prev, posts: prev.posts.map((p) => (p.id === id ? ({ ...p, ...post } as Post) : p)) },
      )
      return { rollback }
    },
    onError: (_err, _vars, ctx) => ctx?.rollback?.(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "active" })
    },
  })
}

// 게시물 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      const pairs = queryClient.getQueriesData<PostsApiResponse>({ queryKey: ["posts"] })
      const rollback = updateQueriesWithRollback(queryClient, pairs, (prev) => {
        if (!prev?.posts) return prev
        const nextPosts = prev.posts.filter((p) => p.id !== id)
        const removed = nextPosts.length !== prev.posts.length
        return { ...prev, posts: nextPosts, total: Math.max(0, (prev.total || 0) - (removed ? 1 : 0)) }
      })
      return { rollback }
    },
    onError: (_err, _vars, ctx) => ctx?.rollback?.(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "active" })
    },
  })
}
