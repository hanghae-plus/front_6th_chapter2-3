import { atom, useAtom } from "jotai"
import { useState, useEffect } from "react"
import type { Post, PostResponse } from "../entities/Post/Post"
import type { User, UserResponse } from "../entities/User/User"
import { useQueryParams } from "./useQueryParams"

export const postsAtom = atom<Post[]>([])

export function usePosts() {
  const { skip, limit, searchQuery, sortBy, sortOrder, selectedTag } = useQueryParams()

  const [posts, setPosts] = useAtom(postsAtom)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // 게시물 가져오기
  const fetchPosts = () => {
    setLoading(true)
    let postsData: PostResponse
    let usersData: User[]

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        postsData = data
        return fetch("/api/users?limit=0&select=username,image")
      })
      .then((response) => response.json())
      .then((users) => {
        usersData = users.users
        const postsWithUsers = postsData.posts.map((post) => ({
          ...post,
          author: usersData.find((user) => user.id === post.userId),
        }))
        setPosts(postsWithUsers)
        setTotal(postsData.total)
      })
      .catch((error) => {
        console.error("게시물 가져오기 오류:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch("/api/users?limit=0&select=username,image"),
      ])
      const postsData = (await postsResponse.json()) as PostResponse
      const usersData = (await usersResponse.json()) as UserResponse

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`)
      const data = await response.json()
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  return {
    posts,
    setPosts,
    total,
    loading,
    fetchPosts,
    fetchPostsByTag,
    searchPosts,
  }
}
