import { http, HttpResponse } from "msw"

export const handlers = [
  // 게시물 목록 조회
  http.get("/api/posts", () => {
    return HttpResponse.json({
      posts: [
        {
          id: 1,
          title: "Test Post 1",
          body: "This is test post 1 content",
          userId: 1,
          reactions: {
            likes: 5,
            dislikes: 1,
          },
          tags: ["test", "sample"],
        },
        {
          id: 2,
          title: "Test Post 2",
          body: "This is test post 2 content",
          userId: 2,
          reactions: {
            likes: 3,
            dislikes: 0,
          },
          tags: ["demo", "example"],
        },
      ],
      total: 2,
      skip: 0,
      limit: 10,
    })
  }),

  // 게시물 검색
  http.get("/api/posts/search", ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get("q")

    // "test"가 포함된 검색일 때
    if (query?.toLowerCase().includes("test")) {
      return HttpResponse.json({
        posts: [
          {
            id: 1,
            title: "Test Post 1",
            body: "This is test post 1 content",
            userId: 1,
            reactions: {
              likes: 5,
              dislikes: 1,
            },
            tags: ["test", "sample"],
          },
        ],
        total: 1,
        skip: 0,
        limit: 10,
      })
    }

    // 다른 검색어는 빈 결과
    return HttpResponse.json({
      posts: [],
      total: 0,
      skip: 0,
      limit: 10,
    })
  }),

  // 사용자 목록 조회
  http.get("/api/users", () => {
    return HttpResponse.json({
      users: [
        { id: 1, username: "user1", firstName: "John", lastName: "Doe" },
        { id: 2, username: "user2", firstName: "Jane", lastName: "Smith" },
      ],
      total: 2,
      skip: 0,
      limit: 30,
    })
  }),

  // 태그 목록 조회
  http.get("/api/posts/tags", () => {
    return HttpResponse.json(["test", "sample", "demo", "example"])
  }),
]
