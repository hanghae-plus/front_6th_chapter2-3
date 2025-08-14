import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { Post, PostResponse } from "../../types/product.type"
import { UserResponse } from "../../types/user.type"
import { createPost, deletePost, getUserById, updatePost } from "../api"
import { URL_PATH } from "../config/routes"
import { loadingAtom, postsAtom, tagsAtom, totalAtom } from "../stores/postsAtoms"

// 게시물 목록 조회
export const usePosts = (limit: number, skip: number) => {
  const [, setPosts] = useAtom(postsAtom)
  const [, setLoading] = useAtom(loadingAtom)
  const [, setTotal] = useAtom(totalAtom)

  return useQuery({
    queryKey: ["posts", limit, skip],
    queryFn: async () => {
      setLoading(true)
      try {
        const response = await fetch(`${URL_PATH.POSTS.LIST}?limit=${limit}&skip=${skip}`)
        const postsData = (await response.json()) as PostResponse
        const postsWithUsers: Post[] = await Promise.all(
          postsData.posts.map(async (post) => ({
            ...post,
            author: await getUserById(post.userId),
          })),
        )
        setPosts(postsWithUsers)
        setTotal(postsData.total)
        return postsWithUsers
      } finally {
        setLoading(false)
      }
    },
    enabled: false, // 수동으로 호출하도록 설정
  })
}

// 게시물 검색
export const useSearchPosts = (query: string) => {
  const [, setPosts] = useAtom(postsAtom)
  const [, setLoading] = useAtom(loadingAtom)
  const [, setTotal] = useAtom(totalAtom)

  return useQuery({
    queryKey: ["posts", "search", query],
    queryFn: async () => {
      if (!query) return []
      setLoading(true)
      try {
        const response = await fetch(`${URL_PATH.POSTS.SEARCH}?q=${query}`)
        const data = (await response.json()) as PostResponse
        setPosts(data.posts)
        setTotal(data.total)
        return data.posts
      } finally {
        setLoading(false)
      }
    },
    enabled: !!query,
  })
}

// 태그별 게시물 조회
export const usePostsByTag = (tag: string) => {
  const [, setPosts] = useAtom(postsAtom)
  const [, setLoading] = useAtom(loadingAtom)
  const [, setTotal] = useAtom(totalAtom)

  return useQuery({
    queryKey: ["posts", "tag", tag],
    queryFn: async () => {
      if (!tag || tag === "all") return []
      setLoading(true)
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          fetch(URL_PATH.POSTS.BY_TAG(tag)),
          fetch(`${URL_PATH.USERS.LIST}?limit=0&select=username,image`),
        ])
        const postsData = (await postsResponse.json()) as PostResponse
        const usersData = (await usersResponse.json()) as UserResponse

        const postsWithUsers = postsData.posts.map((post) => ({
          ...post,
          author: usersData.users.find((user) => user.id === post.userId),
        }))
        setPosts(postsWithUsers)
        setTotal(postsData.total)
        return postsWithUsers
      } finally {
        setLoading(false)
      }
    },
    enabled: !!tag && tag !== "all",
  })
}

// 태그 목록 조회
export const useTags = () => {
  const [, setTags] = useAtom(tagsAtom)

  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await fetch(URL_PATH.POSTS.TAGS)
      const data = await response.json()
      setTags(data)
      return data
    },
  })
}

// 게시물 생성
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const [posts, setPosts] = useAtom(postsAtom)

  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      setPosts([data, ...posts])
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}

// 게시물 수정
export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const [posts, setPosts] = useAtom(postsAtom)

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) => updatePost(id, data),
    onSuccess: (data) => {
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}

// 게시물 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const [posts, setPosts] = useAtom(postsAtom)

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, id) => {
      setPosts(posts.filter((post) => post.id !== id))
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
