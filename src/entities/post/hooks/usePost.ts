import { useState, useEffect } from "react"
import {
  getPostApi,
  addPostApi,
  updatePostApi,
  deletePostApi,
  getTagApi,
  searchPostApi,
  getPostsByTagApi,
} from "../api/post-api"
import { getUserApi } from "../../user/api/user-api"
import { loadingAtom } from "../../../shared/model/store"
import {
  postsAtom,
  totalPostsAtom,
  tagsAtom,
  selectedTagAtom,
  searchQueryAtom,
  skipAtom,
  limitAtom,
  selectedPostAtom,
  showEditDialogAtom,
  showAddDialogAtom,
  newPostAtom,
} from "../model/store"
import { useAtom } from "jotai"

export const usePost = () => {
  const [loading, setLoading] = useAtom(loadingAtom)
  const [posts, setPosts] = useAtom(postsAtom)
  const [total, setTotal] = useAtom(totalPostsAtom)
  const [tags, setTags] = useAtom(tagsAtom)
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [skip, setSkip] = useAtom(skipAtom)
  const [limit, setLimit] = useAtom(limitAtom)
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [newPost, setNewPost] = useAtom(newPostAtom)

  // 게시물 목록 가져오기
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([getPostApi(limit, skip), getUserApi()])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()
      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 태그 목록 가져오기
  const fetchTags = async () => {
    try {
      const response = await getTagApi()
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag) => {
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([getPostsByTagApi(tag, limit, skip), getUserApi()])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()
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
  const searchPosts = async (query) => {
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([searchPostApi(query, limit, skip), getUserApi()])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()
      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 게시물 추가
  const addPost = async () => {
    try {
      const data = await addPostApi(newPost)
      setPosts([data, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 수정
  const updatePost = async () => {
    try {
      const response = await updatePostApi(selectedPost)
      const data = await response.json()
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id) => {
    try {
      await deletePostApi(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  return {
    posts,
    total,
    tags,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    skip,
    setSkip,
    limit,
    setLimit,
    selectedPost,
    setSelectedPost,
    showEditDialog,
    setShowEditDialog,
    showAddDialog,
    setShowAddDialog,
    newPost,
    setNewPost,
    fetchPosts,
    fetchPostsByTag,
    searchPosts,
    addPost,
    updatePost,
    deletePost,
    fetchTags,
  }
}
