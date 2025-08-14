import { queryOptions } from "@tanstack/react-query"
import { getPosts, getPostBySearch, getPostByTag, getPost } from "@/entities/post/api"
import { getUsers } from "@/entities/user/api"
import { getCommentsByPost } from "@/entities/comment/api"
import type { PostFilter, Post, User, Author } from "@/shared/types"

// 게시물 + 작성자 join 쿼리 (통합)
export const postWithAuthorQueries = {
  list: (filters: PostFilter & { searchQuery?: string; selectedTag?: string }) =>
    queryOptions({
      queryKey: ["posts", "list", filters],
      queryFn: async () => {
        const { searchQuery, selectedTag, ...otherFilters } = filters

        let postsResponse

        if (searchQuery) {
          // 검색어가 있으면 검색 API 사용
          postsResponse = await getPostBySearch(searchQuery)
        } else if (selectedTag && selectedTag !== "all") {
          // 태그가 있고 "all"이 아니면 태그 API 사용
          postsResponse = await getPostByTag(selectedTag)
        } else {
          // 둘 다 없으면 일반 목록 API 사용
          postsResponse = await getPosts(otherFilters)
        }

        // 사용자 정보 가져오기
        const usersResponse = await getUsers()

        const map = new Map(usersResponse.users.map((u: User) => [u.id, u]))
        const posts = postsResponse.posts.map((po: Post) => ({ ...po, author: map.get(po.userId) as Author }))

        return { posts, total: postsResponse.total }
      },
      staleTime: 30_000,
      gcTime: 10 * 60 * 1000,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ["posts", "detail", id],
      queryFn: async () => {
        // 게시물과 댓글을 병렬로 가져오기
        const [postResponse, commentsResponse, usersResponse] = await Promise.all([
          getPost(id),
          getCommentsByPost(id),
          getUsers(),
        ])

        // 사용자 정보를 Map으로 변환하여 빠른 조회 가능하게 함
        const userMap = new Map(usersResponse.users.map((u: User) => [u.id, u]))

        // 게시물에 작성자 정보 추가
        const postWithAuthor = {
          ...postResponse,
          author: userMap.get(postResponse.userId) as Author,
        }

        // 댓글은 이미 user 정보가 포함되어 있으므로 그대로 사용
        const comments = commentsResponse.comments

        return {
          post: postWithAuthor,
          comments: comments,
          total: commentsResponse.total,
        }
      },
      staleTime: 10 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
    }),
}
