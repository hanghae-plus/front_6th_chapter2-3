/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from "msw"

// 간단한 메모리 상태 - 각 테스트에서 setup에서 재설정 가능
export const createDb = () => {
  const users = Array.from({ length: 5 }).map((_, i) => ({
    address: { address: `Addr ${i + 1}`, city: "Seoul", state: "KR" },
    age: 20 + i,
    company: { name: "ACME", title: "Engineer" },
    email: `user${i + 1}@example.com`,
    firstName: `First${i + 1}`,
    id: i + 1,
    image: `https://picsum.photos/seed/u${i + 1}/64/64`,
    lastName: `Last${i + 1}`,
    phone: `010-0000-00${i + 1}`,
    username: `user${i + 1}`,
  }))

  let posts = Array.from({ length: 25 }).map((_, i) => ({
    body: `Post body ${i + 1}`,
    id: i + 1,
    reactions: { dislikes: Math.floor(i / 3), likes: i },
    tags: ["tag-a", i % 2 === 0 ? "tag-b" : "tag-c"],
    title: `Post ${i + 1}`,
    userId: (i % users.length) + 1,
  }))

  const commentsByPost: Record<
    number,
    Array<{ body: string; id: number; likes: number; postId: number; user: { username: string } }>
  > = {}
  let nextCommentId = 1

  const ensureComments = (postId: number) => {
    if (!commentsByPost[postId]) {
      commentsByPost[postId] = Array.from({ length: 2 }).map((_, i) => ({
        body: `Comment ${i + 1} for post ${postId}`,
        id: nextCommentId++,
        likes: 0,
        postId,
        user: { username: users[(postId + i) % users.length].username },
      }))
    }
    return commentsByPost[postId]
  }

  return { commentsByPost, ensureComments, posts, users }
}

export const buildHandlers = (db = createDb()) => [
  // posts
  http.get("/api/posts", ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get("limit") ?? 10)
    const skip = Number(url.searchParams.get("skip") ?? 0)
    const slice = db.posts.slice(skip, skip + limit)
    return HttpResponse.json({ limit, posts: slice, skip, total: db.posts.length })
  }),

  http.get("/api/posts/tags", () => {
    const uniq = Array.from(new Set(db.posts.flatMap((p) => p.tags)))
    return HttpResponse.json(uniq.map((t) => ({ slug: t, url: `/tags/${t}` })))
  }),

  http.get("/api/posts/tag/:tag", ({ params }) => {
    const tag = String(params.tag)
    const filtered = db.posts.filter((p) => p.tags.includes(tag))
    return HttpResponse.json({ posts: filtered, total: filtered.length })
  }),

  http.get("/api/posts/search", ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get("q") ?? "").toLowerCase()
    const filtered = db.posts.filter((p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q))
    return HttpResponse.json({ posts: filtered, total: filtered.length })
  }),

  http.post("/api/posts/add", async ({ request }) => {
    const body = (await request.json()) as any
    const newPost = { id: db.posts.length + 1, reactions: { dislikes: 0, likes: 0 }, tags: [], ...body }
    db.posts = [newPost, ...db.posts]
    return HttpResponse.json(newPost)
  }),

  http.put("/api/posts/:id", async ({ params, request }) => {
    const id = Number(params.id)
    const update = (await request.json()) as any
    db.posts = db.posts.map((p) => (p.id === id ? { ...p, ...update } : p))
    const found = db.posts.find((p) => p.id === id)
    return HttpResponse.json(found)
  }),

  http.delete("/api/posts/:id", ({ params }) => {
    const id = Number(params.id)
    const deletedPost = db.posts.find((p) => p.id === id)
    db.posts = db.posts.filter((p) => p.id !== id)
    return HttpResponse.json(deletedPost) // 삭제된 게시물 객체 반환
  }),

  // users
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url)
    const select = (url.searchParams.get("select") ?? "").split(",")
    const users = db.users.map((u) => {
      const base: any = { id: u.id }
      for (const key of select) {
        if (!key) continue
        base[key] = (u as any)[key]
      }
      return base
    })
    return HttpResponse.json({ users })
  }),

  http.get("/api/users/:id", ({ params }) => {
    const id = Number(params.id)
    const user = db.users.find((u) => u.id === id)
    if (!user) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(user)
  }),

  // comments
  http.get("/api/comments/post/:postId", ({ params }) => {
    const postId = Number(params.postId)
    const comments = db.ensureComments(postId)
    return HttpResponse.json({ comments })
  }),

  http.post("/api/comments/add", async ({ request }) => {
    const { body, postId } = (await request.json()) as any
    const comments = db.ensureComments(postId)
    const newComment = {
      body,
      id: comments.length ? Math.max(...comments.map((c) => c.id)) + 1 : 1,
      likes: 0,
      postId,
      user: { username: "me" },
    }
    comments.push(newComment)
    return HttpResponse.json(newComment)
  }),

  http.put("/api/comments/:id", async ({ params, request }) => {
    const id = Number(params.id)
    const update = (await request.json()) as any
    for (const postId of Object.keys(db.commentsByPost)) {
      const pid = Number(postId)
      const list = db.commentsByPost[pid]
      const idx = list?.findIndex((c) => c.id === id) ?? -1
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...update }
        return HttpResponse.json(list[idx])
      }
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.delete("/api/comments/:id", ({ params }) => {
    const id = Number(params.id)
    for (const postId of Object.keys(db.commentsByPost)) {
      const pid = Number(postId)
      const list = db.commentsByPost[pid]
      const next = list?.filter((c) => c.id !== id) ?? []
      db.commentsByPost[pid] = next
    }
    return HttpResponse.json({ success: true })
  }),

  http.patch("/api/comments/:id", async ({ params, request }) => {
    const id = Number(params.id)
    const update = (await request.json()) as any
    for (const postId of Object.keys(db.commentsByPost)) {
      const pid = Number(postId)
      const list = db.commentsByPost[pid]
      const idx = list?.findIndex((c) => c.id === id) ?? -1
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...update }
        return HttpResponse.json(list[idx])
      }
    }
    return new HttpResponse(null, { status: 404 })
  }),
]
