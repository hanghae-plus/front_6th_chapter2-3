import { QueryClient } from "@tanstack/react-query"

// 게시글 캐시 업데이트 헬퍼 함수들
export const updatePostsCache = (queryClient: QueryClient, updater: (oldData: any) => any) => {
  queryClient.setQueriesData({ queryKey: ["posts"] }, updater)
}

export const addPostToCache = (queryClient: QueryClient, newPost: any) => {
  updatePostsCache(queryClient, (oldData: any) => {
    if (!oldData?.posts) return oldData

    return {
      ...oldData,
      posts: [newPost, ...oldData.posts],
      total: oldData.total + 1,
    }
  })
}

export const updatePostInCache = (queryClient: QueryClient, id: number, updates: any) => {
  updatePostsCache(queryClient, (oldData: any) => {
    if (!oldData?.posts) return oldData

    return {
      ...oldData,
      posts: oldData.posts.map((p: any) => (p.id === id ? { ...p, ...updates } : p)),
    }
  })
}

export const deletePostFromCache = (queryClient: QueryClient, id: number) => {
  updatePostsCache(queryClient, (oldData: any) => {
    if (!oldData?.posts) return oldData

    return {
      ...oldData,
      posts: oldData.posts.filter((p: any) => p.id !== id),
      total: oldData.total - 1,
    }
  })
}
