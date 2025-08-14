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
import { useURL } from "../../shared/hook/useURL"

export const PostList = () => {
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<Tags>([])
  const { comments, setComments } = useCommentStore()
  const { setSelectedPost, setShowEditDialog, setShowPostDetailDialog, posts, setPosts } = useSelectedPostStore()
  const { setSelectedUser, setShowUserModal } = useSelectedUserStore()
  const { searchQuery, setSearchQuery } = useSearchQueryStore()
  const {
    skip,
    limit,
    sortBy,
    sortOrder,
    selectedTag,
    setSkip,
    setLimit,
    setSortBy,
    setSortOrder,
    setSelectedTag,
    updateURL,
  } = useURL()

  useEffect(() => {
    fetchTags()
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
      const { result, data: tags } = await getTags()
      if (result && tags) {
        setTags(tags)
      }
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 게시물 가져오기
  const fetchPosts = async () => {
    setLoading(true)

    try {
      const { result, data: posts } = await getPosts(limit, skip)
      if (result && posts) {
        const { result, data: users } = await getUsers()
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
      const { result, data: postsData } = await getSeachPosts(searchQuery)

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
      const { result: postResult, data: posts } = await getPostsByTag(tag)
      const { result: userResult, data: users } = await getUsers()

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
      const { result, data: userData } = await getUser(user.id)
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
      const { result, data: commentData } = await getComments(postId)
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
