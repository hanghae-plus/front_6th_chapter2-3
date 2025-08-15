import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import PostAPI from "../api/PostAPI"
import { CreatePost, UpdatePost } from "./types"
import { addPostToCache, updatePostInCache, deletePostFromCache } from "../../../shared/lib/cache"

// Query Keys 상수 정의
const QUERY_KEYS = {
  POSTS: "posts",
  TAGS: "tags",
} as const

/**
 * 게시글 목록 조회
 * @param limit - 한 페이지에 표시할 게시글 수
 * @param skip - 건너뛸 게시글 수
 * @param sortBy - 정렬 기준
 * @param Order - 정렬 순서
 * @param tag - 태그 (선택사항)
 * @param searchQuery - 검색어 (선택사항)
 * @returns 게시글 목록
 */
export const usePosts = (
  limit: number,
  skip: number,
  sortBy?: string,
  order?: string,
  tag?: string,
  searchQuery?: string,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, { limit, skip, sortBy, order, tag, searchQuery }],
    queryFn: () => {
      if (tag && tag !== "all") {
        return PostAPI.getPostsByTag(tag, limit, skip, sortBy, order)
      }
      if (searchQuery) {
        return PostAPI.getPostsBySearch(searchQuery, limit, skip, sortBy, order)
      }
      return PostAPI.getPosts(limit, skip, sortBy, order)
    },
  })
}

/**
 * 게시글 추가
 * @param post - 추가할 게시글 정보
 * @returns 추가된 게시글 정보
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: CreatePost) => PostAPI.createPost(post),
    onSuccess: (newPost) => {
      addPostToCache(queryClient, newPost)
    },
  })
}

/**
 * 게시글 업데이트
 * @param post - 업데이트할 게시글 정보
 * @returns 업데이트된 게시글 정보
 */
export const useUpdatePost = (id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: UpdatePost) => PostAPI.updatePost(id, post),
    onSuccess: (updatedPost, variables) => {
      updatePostInCache(queryClient, id, variables)
    },
  })
}

/**
 * 게시글 삭제
 * @param id - 삭제할 게시글 ID
 * @returns 삭제된 게시글 정보
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => PostAPI.deletePost(id),
    onSuccess: (deletedPost, variables) => {
      deletePostFromCache(queryClient, variables)
    },
  })
}

/**
 * 태그 목록 조회
 * @returns 태그 목록
 */
export const useGetTags = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TAGS],
    queryFn: () => PostAPI.getTags(),
  })
}
