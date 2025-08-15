import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

export const handlers = [
  http.get("/api/posts", ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get("limit") ?? "10")
    const skip = Number(url.searchParams.get("skip") ?? "0")
    const users = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      image: `https://picsum.photos/seed/${i + 1}/64/64`,
    }))
    const posts = Array.from({ length: limit }).map((_, i) => {
      const id = skip + i + 1
      return {
        id,
        title: `post ${id}`,
        body: `body ${id}`,
        userId: ((id - 1) % users.length) + 1,
        tags: ["news", "tech"].slice(0, (id % 2) + 1),
        reactions: { likes: id, dislikes: 0 },
      }
    })
    return HttpResponse.json({ posts, total: 100 })
  }),

  http.get("/api/users", () => {
    const users = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      image: `https://picsum.photos/seed/${i + 1}/64/64`,
    }))
    return HttpResponse.json({ users })
  }),

  http.get("/api/posts/tags", () => {
    return HttpResponse.json([
      { url: "/tags/news", slug: "news" },
      { url: "/tags/tech", slug: "tech" },
    ])
  }),

  http.get("/api/posts/search", ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get("q") ?? ""
    const posts = [{ id: 1, title: `match ${q}`, body: `body ${q}`, userId: 1, reactions: { likes: 1, dislikes: 0 } }]
    return HttpResponse.json({ posts, total: posts.length })
  }),

  http.get("/api/posts/tag/:tag", ({ params }) => {
    const { tag } = params
    const posts = [
      {
        id: 1,
        title: `${String(tag)} post`,
        body: "body",
        userId: 1,
        tags: [String(tag)],
        reactions: { likes: 1, dislikes: 0 },
      },
    ]
    const users = { users: [{ id: 1, username: "user1", image: "" }] }
    return HttpResponse.json({ posts, total: 1, users })
  }),

  http.get("/api/comments/post/:postId", ({ params }) => {
    const postId = Number(params.postId)
    const comments = [{ id: 1, body: "nice", postId, user: { username: "user1" }, likes: 0 }]
    return HttpResponse.json({ comments })
  }),

  http.post("/api/posts/add", async ({ request }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({ id: Date.now(), ...body, reactions: { likes: 0, dislikes: 0 } })
  }),

  http.put("/api/posts/:id", async ({ request, params }) => {
    const id = Number(params.id)
    const body = (await request.json()) as any
    return HttpResponse.json({ id, ...body })
  }),

  http.delete("/api/posts/:id", () => HttpResponse.json({ success: true })),

  http.post("/api/comments/add", async ({ request }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({ id: Date.now(), ...body, user: { username: "user1" }, likes: 0 })
  }),

  http.put("/api/comments/:id", async ({ request, params }) => {
    const id = Number(params.id)
    const body = (await request.json()) as any
    return HttpResponse.json({ id, postId: body.postId ?? 1, body: body.body, user: { username: "user1" }, likes: 0 })
  }),

  http.patch("/api/comments/:id", async ({ params }) => {
    const id = Number(params.id)
    return HttpResponse.json({ id, postId: 1, body: "nice", user: { username: "user1" }, likes: 1 })
  }),

  http.delete("/api/comments/:id", () => HttpResponse.json({ success: true })),

  http.get("/api/users/:id", ({ params }) => {
    const id = Number(params.id)
    return HttpResponse.json({
      id,
      username: `user${id}`,
      image: "",
      firstName: "First",
      lastName: "Last",
      age: 20,
      email: "a@a.com",
      phone: "000",
      address: { address: "street", city: "city", state: "state" },
      company: { name: "ACME", title: "Dev" },
    })
  }),
]

export const server = setupServer(...handlers)
