import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@shared/ui"
import { createURLParams, parseURLParams } from "@shared/lib"
import type { Post, NewPost, PostsApiResponse } from "@entities/post"
import type { Comment, NewComment } from "@entities/comment"
import type { User, UsersApiResponse } from "@entities/user"
import {
  PostTable,
  PostFilters,
  PostDetailDialog,
  Pagination,
  UserDialog,
  PostFormDialog,
  CommentFormDialog,
} from "@widgets"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const urlParams = parseURLParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(urlParams.skip)
  const [limit, setLimit] = useState(urlParams.limit)
  const [searchQuery, setSearchQuery] = useState(urlParams.search)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(urlParams.sortBy)
  const [sortOrder, setSortOrder] = useState(urlParams.sortOrder)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })
  const [loading, setLoading] = useState(false)
  const [selectedTag, setSelectedTag] = useState(urlParams.tag)
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<NewComment>({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // URL 업데이트 함수
  const updateURL = () => {
    const params = createURLParams({
      skip,
      limit,
      search: searchQuery,
      sortBy,
      sortOrder,
      tag: selectedTag,
    })
    navigate(`?${params}`)
  }

  // 게시물 가져오기
  const fetchPosts = () => {
    setLoading(true)
    let postsData: PostsApiResponse
    let usersData: User[]

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data: PostsApiResponse) => {
        postsData = data
        return fetch("/api/users?limit=0&select=username,image")
      })
      .then((response) => response.json())
      .then((users: UsersApiResponse) => {
        usersData = users.users
        const postsWithUsers = postsData.posts.map((post: Post) => ({
          ...post,
          author: usersData.find((user: User) => user.id === post.userId),
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

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`)
      const data: PostsApiResponse = await response.json()
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
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
      const postsData: PostsApiResponse = await postsResponse.json()
      const usersData: UsersApiResponse = await usersResponse.json()

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
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
    if (!selectedPost) return

    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      })
      const data = await response.json()
      setPosts(posts.map((post: Post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
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

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data = await response.json()
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
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
      setComments((prev) => ({
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
    if (!selectedComment) return

    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment: Comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: (comments[postId]?.find((c) => c.id === id)?.likes || 0) + 1 }),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment: Comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
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
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = parseURLParams(location.search)
    setSkip(params.skip)
    setLimit(params.limit)
    setSearchQuery(params.search)
    setSortBy(params.sortBy)
    setSortOrder(params.sortOrder)
    setSelectedTag(params.tag)
  }, [location.search])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={searchPosts}
            selectedTag={selectedTag}
            onTagChange={(value) => {
              setSelectedTag(value)
              fetchPostsByTag(value)
              updateURL()
            }}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onTagSelect={(tag) => {
                setSelectedTag(tag)
                updateURL()
              }}
              onOpenDetail={openPostDetail}
              onOpenUser={openUserModal}
              onEdit={(post) => {
                setSelectedPost(post)
                setShowEditDialog(true)
              }}
              onDelete={deletePost}
            />
          )}

          <Pagination
            total={total}
            skip={skip}
            limit={limit}
            onPrev={() => setSkip(Math.max(0, skip - limit))}
            onNext={() => setSkip(skip + limit)}
            onLimitChange={(value) => setLimit(value)}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 다이얼로그 위젯 */}
      <PostFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        formTitle="새 게시물 추가"
        titleValue={newPost.title}
        bodyValue={newPost.body}
        onTitleChange={(v) => setNewPost({ ...newPost, title: v })}
        onBodyChange={(v) => setNewPost({ ...newPost, body: v })}
        showUserId
        userIdValue={newPost.userId}
        onUserIdChange={(val) => setNewPost({ ...newPost, userId: val })}
        submitLabel="게시물 추가"
        onSubmit={addPost}
      />

      {/* 게시물 수정 다이얼로그 위젯 */}
      <PostFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        formTitle="게시물 수정"
        titleValue={selectedPost?.title || ""}
        bodyValue={selectedPost?.body || ""}
        onTitleChange={(v) => selectedPost && setSelectedPost({ ...selectedPost, title: v })}
        onBodyChange={(v) => selectedPost && setSelectedPost({ ...selectedPost, body: v })}
        submitLabel="게시물 업데이트"
        onSubmit={updatePost}
      />

      {/* 댓글 추가 다이얼로그 위젯 */}
      <CommentFormDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        formTitle="새 댓글 추가"
        bodyValue={newComment.body}
        onBodyChange={(v) => setNewComment({ ...newComment, body: v })}
        submitLabel="댓글 추가"
        onSubmit={addComment}
      />

      {/* 댓글 수정 다이얼로그 위젯 */}
      <CommentFormDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        formTitle="댓글 수정"
        bodyValue={selectedComment?.body || ""}
        onBodyChange={(v) => selectedComment && setSelectedComment({ ...selectedComment, body: v })}
        submitLabel="댓글 업데이트"
        onSubmit={updateComment}
      />

      {/* 게시물 상세 보기 다이얼로그 위젯 */}
      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={selectedPost?.id ? comments[selectedPost.id] : []}
        searchQuery={searchQuery}
        onOpenAddComment={(postId) => {
          setNewComment((prev) => ({ ...prev, postId }))
          setShowAddCommentDialog(true)
        }}
        onLikeComment={likeComment}
        onEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onDeleteComment={deleteComment}
      />

      {/* 사용자 다이얼로그 */}
      <UserDialog open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  )
}

export default PostsManager
