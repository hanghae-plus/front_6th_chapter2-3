/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { PostSortBySelect, PostSortOrderSelect, PostTagFilterSelect } from "@/features/get-post/ui"
import { Button } from "@/shared/ui/Button"
import { Card } from "@/shared/ui/Card"
import { Input } from "@/shared/ui/Input"
import { CommentAddDialog, CommentUpdateDialog } from "@/widgets/comment-dialog/ui"
import { PostAddDialog, PostDetailDialog, PostUpdateDialog } from "@/widgets/post-dialog/ui"
import { PostPagination } from "@/widgets/post-pagination/ui"
import { PostTable } from "@/widgets/post-table/ui"
import { UserInfoDialog } from "@/widgets/user-dialog/ui"

export function PostsManagerPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState<any>({ title: "", body: "", userId: 1 })
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<any[]>([])
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [comments, setComments] = useState<any>({})
  const [selectedComment, setSelectedComment] = useState<any>(null)
  const [newComment, setNewComment] = useState<any>({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

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

  // 게시물 가져오기
  const fetchPosts = () => {
    setLoading(true)
    let postsData: any
    let usersData: any

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        postsData = data
        return fetch("/api/users?limit=0&select=username,image")
      })
      .then((response) => response.json())
      .then((users) => {
        usersData = users.users
        const postsWithUsers = postsData.posts.map((post: any) => ({
          ...post,
          author: usersData.find((user: any) => user.id === post.userId),
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

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
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
      const response = await fetch(`/api/posts/search?q=${searchQuery}`)
      const data = await response.json()
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: any) => {
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
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()

      const postsWithUsers = postsData.posts.map((post: any) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 게시물 추가
  const addPost = async () => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      const data = await response.json()
      setPosts([data, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePost = async () => {
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      })
      const data = await response.json()
      setPosts(posts.map((post: any) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: any) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      setPosts(posts.filter((post: any) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: any) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data = await response.json()
      setComments((prev: any) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
    try {
      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
      const data = await response.json()
      setComments((prev: any) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data = await response.json()
      setComments((prev: any) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment: any) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id: any, postId: any) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      setComments((prev: any) => ({
        ...prev,
        [postId]: prev[postId].filter((comment: any) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: any, postId: any) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: comments[postId].find((c: any) => c.id === id).likes + 1 }),
      })
      const data = await response.json()
      setComments((prev: any) => ({
        ...prev,
        [postId]: prev[postId].map((comment: any) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: any) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user: any) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

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

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // 하이라이트 함수 추가
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-6xl">
      <Card.Header>
        <Card.Title className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            게시물 추가
          </Button>
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchPosts()}
                />
              </div>
            </div>

            <PostTagFilterSelect
              selectedTag={selectedTag}
              tags={tags}
              onTagChange={(value) => {
                setSelectedTag(value)
                fetchPostsByTag(value)
                updateURL()
              }}
            />
            <PostSortBySelect sortBy={sortBy} onSortByChange={setSortBy} />
            <PostSortOrderSelect sortOrder={sortOrder} onSortOrderChange={setSortOrder} />
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              highlightText={highlightText}
              onTagClick={(tag: string) => setSelectedTag(tag)}
              onUserClick={openUserModal}
              onPostDetailClick={openPostDetail}
              onPostEditClick={(post: any) => {
                setSelectedPost(post)
                setShowEditDialog(true)
              }}
              onPostDeleteClick={deletePost}
              updateURL={updateURL}
            />
          )}

          <PostPagination limit={limit} skip={skip} total={total} onLimitChange={setLimit} onSkipChange={setSkip} />
        </div>
      </Card.Content>

      {/* 댓글 추가 다이얼로그 */}
      <CommentAddDialog
        addComment={addComment}
        newComment={newComment}
        setNewComment={setNewComment}
        setShowAddCommentDialog={setShowAddCommentDialog}
        showAddCommentDialog={showAddCommentDialog}
      />

      {/* 댓글 수정 다이얼로그 */}
      <CommentUpdateDialog
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        setShowEditCommentDialog={setShowEditCommentDialog}
        showEditCommentDialog={showEditCommentDialog}
        updateComment={updateComment}
      />

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog
        addPost={addPost}
        newPost={newPost}
        setNewPost={setNewPost}
        setShowAddDialog={setShowAddDialog}
        showAddDialog={showAddDialog}
      />

      {/* 게시물 상세 보기 다이얼로그 */}
      <PostDetailDialog
        highlightText={highlightText}
        searchQuery={searchQuery}
        selectedPost={selectedPost}
        setShowPostDetailDialog={setShowPostDetailDialog}
        showPostDetailDialog={showPostDetailDialog}
        comments={comments}
        onAddComment={(postId: any) => {
          setNewComment((prev: any) => ({ ...prev, postId }))
          setShowAddCommentDialog(true)
        }}
        onEditComment={(comment: any) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onDeleteComment={deleteComment}
        onLikeComment={likeComment}
      />

      {/* 게시물 수정 다이얼로그 */}
      <PostUpdateDialog
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        setShowEditDialog={setShowEditDialog}
        showEditDialog={showEditDialog}
        updatePost={updatePost}
      />

      {/* 사용자 정보 보기 다이얼로그 */}
      <UserInfoDialog
        selectedUser={selectedUser} //
        setShowUserModal={setShowUserModal}
        showUserModal={showUserModal}
      />
    </Card>
  )
}
