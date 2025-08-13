import React, { useEffect, useState } from "react"
import { CardContent } from "../../shared/ui"
import PostSearchFilter from "./ui/PostSearchFilter"
import { Pagination } from "../../widgets"
import { PostTable } from "./ui/PostTable"
import { Post } from "./type"
import { getTags, Tags } from "../../entities"
import { getComments, getPosts, getPostsByTag, getSeachPosts, getUser, getUsers } from "../../entities"
import { Author } from "../../shared/types"
import { useSearchQueryStore, useSelectedPostStore, useSelectedUserStore } from "./model/store"
import { useCommentStore } from "../comment/model/store"
import { useNavigate } from "react-router-dom"

export const PostList = ({ queryParams }: { queryParams: URLSearchParams }) => {
  const navigate = useNavigate()
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<Tags>([])
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const { comments, setComments } = useCommentStore()
  const { setSelectedPost, setShowEditDialog, setShowPostDetailDialog, posts, setPosts } = useSelectedPostStore()
  const { setSelectedUser, setShowUserModal } = useSelectedUserStore()
  const { searchQuery, setSearchQuery } = useSearchQueryStore()

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  useEffect(() => {
    fetchTags()
    setSearchQuery(queryParams.get("search") || "")
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const { result, tags } = await getTags()
      if (result && tags) {
        setTags(tags)
      }
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 게시물 가져오기
  const fetchPosts = async () => {
    setLoading(true)

    try {
      const { result, posts } = await getPosts(limit, skip)
      if (result && posts) {
        const { result, users } = await getUsers()
        if (result && users) {
          const postsWithUsers = posts.posts.map((post) => ({
            ...post,
            author: users.users.find((user) => user.id === post.userId),
          })) as Array<Post>

          setPosts(postsWithUsers)
          setTotal(posts.total)
        }
      }
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const { result, posts: postsData } = await getSeachPosts(searchQuery)

      if (result && postsData) {
        setPosts(postsData.posts)
        setTotal(postsData.total)
      }
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  const handleSearchPost = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchPosts()
    }
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string | null) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const { result: postResult, posts } = await getPostsByTag(tag)
      const { result: userResult, users } = await getUsers()

      if (postResult && posts && userResult && users) {
        const postsWithUsers = posts.posts.map((post) => ({
          ...post,
          author: users.users.find((user) => user.id === post.userId),
        }))

        setPosts(postsWithUsers)
        setTotal(posts.total)
      }
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  const handleChangeTag = (value: string) => {
    setSelectedTag(value)
    fetchPostsByTag(value)
    updateURL()
  }

  // 사용자 모달 열기
  const openUserModal = async (user: Author) => {
    try {
      const { result, user: userData } = await getUser(user.id)
      if (result && userData) {
        setSelectedUser(userData)
        setShowUserModal(true)
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      setComments([])
      const { result, comments: commentData } = await getComments(postId)
      if (result && commentData) {
        console.log("commentData")
        console.log(commentData)

        setComments((prev) => ({ ...prev, [postId]: commentData.comments }))
      }
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  const postTableProps = {
    posts,
    searchQuery,
    selectedTag,
    setSelectedTag,
    updateURL,
    openUserModal,
    openPostDetail,
    setSelectedPost,
    setShowEditDialog,
    deletePost,
  }

  const paginationProps = {
    limit,
    setLimit,
    total,
    skip,
    setSkip,
  }

  const filterProps = {
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    tags,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    handleChangeTag,
    handleSearchPost,
  }

  return (
    <>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostSearchFilter {...filterProps} />

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : <PostTable {...postTableProps} />}

          {/* 페이지네이션 */}
          <Pagination {...paginationProps}></Pagination>
        </div>
      </CardContent>
    </>
  )
}
