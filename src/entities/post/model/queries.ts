// entities/post/model/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { postKeys } from "./postQueryKeys"
import { CreatePostRequest, UpdatePost } from "./types"
import { postApi } from "../api"

// 게시물 목록
export const usePostsQuery = (limit: number, skip: number) =>
  useQuery({
    queryKey: postKeys.list(limit, skip),
    queryFn: () => postApi.getPosts(limit, skip),
  })

// 게시물 검색
export const useSearchPostsQuery = (searchQuery: string) =>
  useQuery({
    queryKey: postKeys.search(searchQuery),
    queryFn: () => postApi.searchPosts(searchQuery),
    enabled: !!searchQuery,
  })

// 태그별 게시물
export const usePostsByTagQuery = (tag: string) =>
  useQuery({
    queryKey: postKeys.tag(tag),
    queryFn: () => postApi.getPostsByTag(tag),
    enabled: !!tag,
  })

// 통합 게시물 조회 (검색, 태그, 일반 목록)
export const usePosts = (limit: number, skip: number, searchQuery?: string, selectedTag?: string) => {
  const postsQuery = usePostsQuery(limit, skip)
  const searchQueryResult = useSearchPostsQuery(searchQuery || "")
  const tagQueryResult = usePostsByTagQuery(selectedTag || "")

  if (searchQuery && searchQuery.trim() !== "") {
    return searchQueryResult
  }

  if (selectedTag && selectedTag !== "all" && selectedTag.trim() !== "") {
    return tagQueryResult
  }

  return postsQuery
}

// 게시물 추가
export const useAddPost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (newPost: CreatePostRequest) => postApi.addPost(newPost),
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.all }),
  })
}

// 게시물 수정
export const useUpdatePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updateData }: { id: number; updateData: UpdatePost }) => postApi.updatePost(id, updateData),
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.all }),
  })
}

// 게시물 삭제
export const useDeletePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.all }),
  })
}
