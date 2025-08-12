import { http, HttpResponse } from "msw"

import type { Comment, CommentDetail, Post, PostDetail, PostTag, User } from "../../src/types"
import { mockComments, mockPosts, mockTags, mockUsers } from "./mockData"

let posts: PostDetail[] = [...mockPosts]
let comments: Comment[] = [...mockComments]
let users: User[] = [...mockUsers]
let tags: PostTag[] = [...mockTags]
let postIdCounter: number = posts.length + 1
let commentIdCounter: number = comments.length + 1

export const handlers = [
  // ===== POSTS API =====

  // 게시물 목록 조회 (페이지네이션, 정렬, 필터링 포함)
  http.get("http://localhost:3000/api/posts", ({ request }) => {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const skip = parseInt(url.searchParams.get("skip") || "0")
    const sortBy = url.searchParams.get("sortBy") || ""
    const sortOrder = url.searchParams.get("sortOrder") || "asc"

    const filteredPosts = [...posts]

    // 정렬 적용
    if (sortBy) {
      filteredPosts.sort((a, b) => {
        let aVal = a[sortBy as keyof typeof a]
        let bVal = b[sortBy as keyof typeof b]

        if (sortBy === "reactions") {
          aVal = a.reactions.likes
          bVal = b.reactions.likes
        }

        if (typeof aVal === "string") {
          return sortOrder === "desc"
            ? (bVal?.toString() || "").localeCompare(aVal.toString())
            : aVal.toString().localeCompare(bVal?.toString() || "")
        }

        return sortOrder === "desc" ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number)
      })
    }

    const paginatedPosts = filteredPosts.slice(skip, skip + limit)

    return HttpResponse.json({
      posts: paginatedPosts,
      total: filteredPosts.length,
      skip,
      limit,
    })
  }),

  // 게시물 검색
  http.get("http://localhost:3000/api/posts/search", ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get("q") || ""

    const filteredPosts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) || post.body.toLowerCase().includes(query.toLowerCase()),
    )

    return HttpResponse.json({
      posts: filteredPosts,
      total: filteredPosts.length,
    })
  }),

  // 태그별 게시물 조회
  http.get("http://localhost:3000/api/posts/tag/:tag", ({ params }) => {
    const tag = params.tag as string

    const filteredPosts = posts.filter((post) => post.tags.includes(tag))

    return HttpResponse.json({
      posts: filteredPosts,
      total: filteredPosts.length,
    })
  }),

  // 게시물 생성 - 타입 안전성 강화
  http.post("http://localhost:3000/api/posts/add", async ({ request }) => {
    const newPostData = (await request.json()) as { title: string; body: string; userId: number }
    const newPost: PostDetail = {
      id: postIdCounter++,
      title: newPostData.title,
      body: newPostData.body,
      userId: newPostData.userId,
      tags: [],
      reactions: { likes: 0, dislikes: 0 },
      views: 0,
    }

    posts.unshift(newPost)
    return HttpResponse.json(newPost)
  }),

  // 게시물 수정 - 타입 안전성 강화
  http.put("http://localhost:3000/api/posts/:id", async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const updateData = (await request.json()) as Partial<Post>

    const postIndex = posts.findIndex((p) => p.id === id)
    if (postIndex !== -1) {
      posts[postIndex] = { ...posts[postIndex], ...updateData }
      return HttpResponse.json(posts[postIndex])
    }

    return HttpResponse.json({ message: "Post not found" }, { status: 404 })
  }),

  // 게시물 삭제
  http.delete("http://localhost:3000/api/posts/:id", ({ params }) => {
    const id = parseInt(params.id as string)
    const postIndex = posts.findIndex((p) => p.id === id)

    if (postIndex !== -1) {
      posts.splice(postIndex, 1)
      return HttpResponse.json({ success: true })
    }

    return HttpResponse.json({ message: "Post not found" }, { status: 404 })
  }),

  // ===== USERS API =====

  // 사용자 목록 조회
  http.get("http://localhost:3000/api/users", ({ request }) => {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get("limit") || "0")
    const select = url.searchParams.get("select")

    let resultUsers = [...users]

    // 특정 필드만 선택 - 타입 안전성 강화
    if (select) {
      const fields = select.split(",")
      resultUsers = users.map((user) => {
        const selectedUser: Partial<User> & { id: number } = { id: user.id }
        fields.forEach((field) => {
          const typedField = field as keyof User
          if (user[typedField] !== undefined) {
            ;(selectedUser as Record<string, unknown>)[field] = user[typedField]
          }
        })
        return selectedUser as User
      })
    }

    // 제한 적용
    if (limit > 0) {
      resultUsers = resultUsers.slice(0, limit)
    }

    return HttpResponse.json({ users: resultUsers })
  }),

  // 특정 사용자 조회
  http.get("http://localhost:3000/api/users/:id", ({ params }) => {
    const id = parseInt(params.id as string)
    const user = users.find((u) => u.id === id)

    if (user) {
      return HttpResponse.json(user)
    }

    return HttpResponse.json({ message: "User not found" }, { status: 404 })
  }),

  // ===== COMMENTS API =====

  // 게시물별 댓글 조회
  http.get("http://localhost:3000/api/comments/post/:postId", ({ params }) => {
    const postId = parseInt(params.postId as string)
    const postComments = comments.filter((c) => c.postId === postId)

    return HttpResponse.json({ comments: postComments })
  }),

  // 댓글 생성 - 타입 안전성 강화
  http.post("http://localhost:3000/api/comments/add", async ({ request }) => {
    const newCommentData = (await request.json()) as { body: string; postId: number; userId: number }
    const foundUser = users.find((u) => u.id === newCommentData.userId) || users[0]
    const newComment: CommentDetail = {
      id: commentIdCounter++,
      body: newCommentData.body,
      postId: newCommentData.postId,
      likes: 0,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        fullName: foundUser.username,
      },
    }

    comments.push(newComment)
    return HttpResponse.json(newComment)
  }),

  // 댓글 수정
  http.put("http://localhost:3000/api/comments/:id", async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const updateData = (await request.json()) as Partial<Comment>

    const commentIndex = comments.findIndex((c) => c.id === id)
    if (commentIndex !== -1) {
      comments[commentIndex] = { ...comments[commentIndex], ...updateData }
      return HttpResponse.json(comments[commentIndex])
    }

    return HttpResponse.json({ message: "Comment not found" }, { status: 404 })
  }),

  // 댓글 삭제
  http.delete("http://localhost:3000/api/comments/:id", ({ params }) => {
    const id = parseInt(params.id as string)
    const commentIndex = comments.findIndex((c) => c.id === id)

    if (commentIndex !== -1) {
      comments.splice(commentIndex, 1)
      return HttpResponse.json({ success: true })
    }

    return HttpResponse.json({ message: "Comment not found" }, { status: 404 })
  }),

  // 댓글 좋아요
  http.patch("http://localhost:3000/api/comments/:id", async ({ params, request }) => {
    const id = parseInt(params.id as string)
    const updateData = (await request.json()) as Partial<Comment>

    const commentIndex = comments.findIndex((c) => c.id === id)
    if (commentIndex !== -1) {
      comments[commentIndex] = { ...comments[commentIndex], ...updateData }
      return HttpResponse.json(comments[commentIndex])
    }

    return HttpResponse.json({ message: "Comment not found" }, { status: 404 })
  }),

  // ===== TAGS API =====

  // 태그 목록 조회
  http.get("http://localhost:3000/api/posts/tags", () => {
    return HttpResponse.json(tags)
  }),
]

// 테스트 간 데이터 리셋을 위한 함수
export const resetMockData = () => {
  posts = [...mockPosts]
  comments = [...mockComments]
  users = [...mockUsers]
  tags = [...mockTags]
  postIdCounter = posts.length + 1
  commentIdCounter = comments.length + 1
}
