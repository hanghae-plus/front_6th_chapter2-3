import { useEffect, useState } from "react"
import { requestApi } from "../../../shared/lib"
import { useSearchQueryStore, useSelectedPostStore } from "./store"
import { DeletePost, NewPost, Post } from "../type"
import { getPosts, getPostsByTag, getSeachPosts, getUsers } from "../../../entities"
import { QUERY_KEYS } from "../../../shared/constants/query"
import { useQuery } from "@tanstack/react-query"
import { useAddPostMutation, useDeletePostMutation, useUpdatePostMutation } from "./mutations"

export const userPostInfo = (limit: number, skip: number, sortBy: string, sortOrder: string, selectedTag: string) => {
  const { setPosts } = useSelectedPostStore()
  const { searchQuery } = useSearchQueryStore()
  const [total, setTotal] = useState(0)
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>("")

  const { data: posts, isLoading: isPostLoading } = useQuery({
    queryKey: QUERY_KEYS.getPosts(limit, skip, sortBy, sortOrder),
    queryFn: async () => {
      const [postResult, userResult] = await Promise.all([getPosts(limit, skip, sortBy, sortOrder), getUsers()])

      if (postResult.result && postResult.data && userResult.result && userResult.data) {
        const postsWithUsers = postResult.data.posts.map((post) => ({
          ...post,
          author: (userResult?.data?.users ?? []).find((user) => user.id === post.userId),
        })) as Array<Post>

        return {
          posts: postsWithUsers,
          total: postResult.data.total,
        }
      }
      throw new Error("데이터를 가져올 수 없습니다")
    },
    enabled: !selectedTag || selectedTag === "all",
  })

  // 태그별 게시물 가져오기
  const { data: postsByTag, isLoading: isPostsByTagLoading } = useQuery({
    queryKey: QUERY_KEYS.getPostsByTag(selectedTag!),
    queryFn: async () => {
      const [postResult, userResult] = await Promise.all([getPostsByTag(selectedTag!), getUsers()])

      if (postResult.result && postResult.data && userResult.result && userResult.data) {
        const postsWithUsers = postResult.data.posts.map((post) => ({
          ...post,
          author: (userResult.data?.users ?? []).find((user) => user.id === post.userId),
        }))

        return {
          posts: postsWithUsers,
          total: postResult.data.total,
        }
      }
      throw new Error("데이터를 가져올 수 없습니다")
    },
    enabled: !!selectedTag && selectedTag !== "all", // selectedTag가 있고 "all"이 아닐 때만 실행
  })

  // 게시물 검색
  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: QUERY_KEYS.getSeachPosts(searchQuery!),
    queryFn: async () => {
      const { result, data: postsData } = await getSeachPosts(searchQuery!)

      if (result && postsData) {
        return {
          posts: postsData.posts,
          total: postsData.total,
        }
      }
      throw new Error("검색 결과를 가져올 수 없습니다")
    },
    enabled: !!activeSearchQuery,
  })

  // 실제 사용할 데이터
  const finalPosts = searchQuery
    ? searchResults?.posts
    : selectedTag && selectedTag !== "all"
      ? postsByTag?.posts
      : posts?.posts

  const finalTotal = searchQuery
    ? searchResults?.total
    : selectedTag && selectedTag !== "all"
      ? postsByTag?.total
      : posts?.total

  // loading 상태
  const loading = searchQuery
    ? isSearchLoading
    : selectedTag && selectedTag !== "all"
      ? isPostsByTagLoading
      : isPostLoading

  // store 업데이트
  useEffect(() => {
    if (finalPosts) {
      setPosts(finalPosts)
      setTotal(finalTotal || 0)
    }
  }, [finalPosts, finalTotal])

  // 태그별 게시물 가져오기

  return {
    total,
    loading,
    setActiveSearchQuery,
  }
}

export const usePostForm = () => {
  const { setShowAddDialog, setShowEditDialog, setPosts, posts, selectedPost, setSelectedPost } = useSelectedPostStore()

  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })

  const handleChangeNewPost = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPost((prev) => ({ ...prev, [name]: value }))
  }

  // 게시물 추가
  const addPostMutation = useAddPostMutation()
  const addPost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      alert("제목과 내용을 입력해주세요")
      return
    }

    addPostMutation.mutate(newPost, {
      onSuccess: () => {
        // 성공 시 폼 초기화
        setNewPost({ title: "", body: "", userId: 1 })
      }
    })
  }

  const handleChangeSelectedPost = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSelectedPost({ ...selectedPost, [name]: value })
  }

  // 게시물 업데이트
  const updatePostMutation = useUpdatePostMutation()
  const updatePost = async () => {
    if (!selectedPost.title.trim() || !selectedPost.body.trim()) {
      alert("제목과 내용을 입력해주세요")
      return
    }

    updatePostMutation.mutate(selectedPost)
  }

  // 게시물 삭제
  const deletePostMutation = useDeletePostMutation()
  const deletePost = async (id: number) => {
    deletePostMutation.mutate(id)

  return {
    newPost,
    handleChangeNewPost,
    addPost,
    handleChangeSelectedPost,
    updatePost,
    deletePost,
  }
}
