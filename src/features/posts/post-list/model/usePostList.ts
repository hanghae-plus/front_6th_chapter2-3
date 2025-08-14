import { getPosts, getPostsParams, getPostsSearch, getPostsTags, getPostsTagTagName } from "../../../../entities/posts"
import { getUsers, getUsersData, getUsersParams } from "../../../../entities/users"
import { useLoading } from "../../../../shared/store"
import type { PostsWithUsers } from "../ui/PostList"
import type { Post, PostsTags } from "../../../../entities/posts/api/types"
import { SetStateAction } from "react"

export const usePostList = () => {
  const { setLoading } = useLoading()

  const fetchPosts = async (limit: number, skip: number) => {
    const params: getPostsParams = {
      limit,
      skip: skip.toString(),
    }
    const response = await getPosts(params)
    return response.data
  }

  const fetchUsers = async () => {
    const params: getUsersParams = {
      limit: 0,
      select: "username,image",
    }
    const response = await getUsers(params)
    return response.data
  }

  const loadData = async (
    limit: number,
    skip: number,
    setPosts: (posts: PostsWithUsers[]) => void,
    setTotal: (total: number) => void,
  ) => {
    try {
      setLoading(true)
      const postsRes = await fetchPosts(limit, skip)
      const usersRes = await fetchUsers()
      const { users: usersData } = usersRes

      const postsWithUsers = postsRes.posts.map((post) => ({
        ...post,
        author: usersData.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsRes.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchPosts = async (
    searchQuery: string,
    setPosts: (value: SetStateAction<Array<Post>>) => void,
    setTotal: (total: SetStateAction<number>) => void,
    loadData: () => Promise<void>,
  ) => {
    if (!searchQuery) {
      loadData()
      return
    }
    setLoading(true)
    try {
      const response = await getPostsSearch(searchQuery)
      const data = response.data
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  const fetchPostsByTag = async (
    tagName: string,
    limit: number,
    skip: number,
    setPosts: (value: SetStateAction<Array<Post>>) => void,
    setTotal: (total: SetStateAction<number>) => void,
    loadData: () => Promise<void>,
  ) => {
    if (!tagName || tagName === "all") {
      loadData()
      return
    }
    setLoading(true)
    try {
      const [postsTagTagNameRes, usersRes] = await Promise.all([
        getPostsTagTagName(tagName, {
          limit,
          skip: skip.toString(),
        }),
        getUsers({
          limit: 0,
          select: "username,image",
        }),
      ])
      const postsData = postsTagTagNameRes.data
      const usersData = usersRes.data as getUsersData

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

  const fetchTags = async (setTags: (tags: PostsTags[]) => void) => {
    try {
      const response = await getPostsTags()
      const data = response.data
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  const filteredPostTag = (tagName: string, setSelectedTag: (tag: string) => void, updateURL: () => void) => {
    setSelectedTag(tagName)
    updateURL()
  }

  return {
    loadData,
    searchPosts,
    fetchPostsByTag,
    fetchTags,
    filteredPostTag,
  }
}
