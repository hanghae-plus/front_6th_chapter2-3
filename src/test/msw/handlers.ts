import { http, HttpResponse } from "msw"

type Post = {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: { likes?: number; dislikes?: number }
}

type User = {
  id: number
  username: string
  image: string
}

type Comment = {
  id: number
  body: string
  likes: number
  postId: number
  user: { id: number; username: string }
}

let posts: Post[] = [
  { id: 1, title: "첫 번째 글", body: "본문 A", userId: 1, tags: ["alpha"], reactions: { likes: 1, dislikes: 0 } },
  { id: 2, title: "두 번째 글", body: "본문 B", userId: 2, tags: ["beta"], reactions: { likes: 0, dislikes: 0 } },
]

const users: User[] = [
  { id: 1, username: "alice", image: "/u/alice.png" },
  { id: 2, username: "bob", image: "/u/bob.png" },
]

const commentsByPost: Record<number, Comment[]> = {
  1: [
    { id: 11, body: "코멘트 1", likes: 0, postId: 1, user: { id: 1, username: "alice" } },
    { id: 12, body: "코멘트 2", likes: 1, postId: 1, user: { id: 2, username: "bob" } },
  ],
  2: [],
}

export const handlers = [
  // posts
  http.get("/api/posts", ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get("limit") || 10)
    const skip = Number(url.searchParams.get("skip") || 0)
    const data = posts.slice(skip, skip + limit)
    return HttpResponse.json({ limit, skip, total: posts.length, posts: data })
  }),
  http.get("/api/posts/tags", () => HttpResponse.json(["alpha", "beta"])),
  http.get("/api/posts/tags/:slug", ({ params }) => {
    const slug = params.slug as string
    const data = posts.filter((p) => p.tags?.includes(slug))
    return HttpResponse.json({ limit: data.length, skip: 0, total: data.length, posts: data })
  }),
  http.post("/api/posts/add", async ({ request }) => {
    const body = (await request.json()) as Partial<Post>
    const newPost: Post = {
      id: posts.length + 1,
      title: String(body.title || ""),
      body: String(body.body || ""),
      userId: Number(body.userId || 0),
      tags: [],
      reactions: { likes: 0, dislikes: 0 },
    }
    posts = [newPost, ...posts]
    return HttpResponse.json({ id: newPost.id, title: newPost.title, body: newPost.body, userId: newPost.userId })
  }),
  http.put("/api/posts/:id", async ({ params, request }) => {
    const id = Number(params.id)
    const body = (await request.json()) as Partial<Post>
    posts = posts.map((p) => (p.id === id ? { ...p, ...body } : p))
    return HttpResponse.json({ ok: true })
  }),
  http.delete("/api/posts/:id", ({ params }) => {
    const id = Number(params.id)
    posts = posts.filter((p) => p.id !== id)
    return HttpResponse.json({ ok: true })
  }),

  // comments
  http.get("/api/comments/post/:postId", ({ params }) => {
    const postId = Number(params.postId)
    const comments = commentsByPost[postId] || []
    return HttpResponse.json({ limit: comments.length, skip: 0, total: comments.length, comments })
  }),
  http.post("/api/comments/add", async ({ request }) => {
    const body = (await request.json()) as Partial<Comment>
    const postId = Number(body.postId || 0)
    const newComment: Comment = {
      id: Date.now(),
      body: String(body.body || ""),
      likes: 0,
      postId,
      user: { id: 1, username: "alice" },
    }
    commentsByPost[postId] = [newComment, ...(commentsByPost[postId] || [])]
    return HttpResponse.json(newComment)
  }),
  http.put("/api/comments/:id", async ({ params, request }) => {
    const id = Number(params.id)
    const body = (await request.json()) as { body: string }
    for (const pid of Object.keys(commentsByPost)) {
      commentsByPost[Number(pid)] = (commentsByPost[Number(pid)] || []).map((c) =>
        c.id === id ? { ...c, body: body.body } : c,
      )
    }
    return HttpResponse.json({ ok: true })
  }),
  http.delete("/api/comments/:id", ({ params }) => {
    const id = Number(params.id)
    for (const pid of Object.keys(commentsByPost)) {
      commentsByPost[Number(pid)] = (commentsByPost[Number(pid)] || []).filter((c) => c.id !== id)
    }
    return HttpResponse.json({ ok: true })
  }),
  http.patch("/api/comments/:id", async ({ params, request }) => {
    const id = Number(params.id)
    const body = (await request.json()) as { likes: number }
    for (const pid of Object.keys(commentsByPost)) {
      commentsByPost[Number(pid)] = (commentsByPost[Number(pid)] || []).map((c) =>
        c.id === id ? { ...c, likes: body.likes } : c,
      )
    }
    return HttpResponse.json({ ok: true })
  }),

  // users
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get("limit") || users.length)
    const skip = Number(url.searchParams.get("skip") || 0)
    const data = users.slice(skip, skip + limit)
    return HttpResponse.json({ limit, skip, total: users.length, users: data })
  }),
  http.get("/api/users/:id", ({ params }) => {
    const id = Number(params.id)
    const user = users.find((u) => u.id === id)
    if (!user) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(user)
  }),
]


