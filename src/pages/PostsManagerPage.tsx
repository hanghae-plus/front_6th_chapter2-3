import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent } from "../shared/ui"
import { PostTable } from "../feature/post/ui/PostTable"
import { Author } from "../shared/types"
import { INIT_POST } from "../shared/data"
import {
  User,
  Comment,
  Tags,
  getPosts,
  getUsers,
  getTags,
  getUser,
  getComments,
  getSeachPosts,
  getPostsByTag,
} from "../entities"
import { NewComment } from "../feature/comment/type"
import { NewPost, Post } from "../feature/post/type"
import { CommentAddDialog } from "../feature"
import { CommentEditDialog } from "../feature/comment/ui/CommentEditDialog"
import { Comments } from "../feature/comment/ui/Comments"
import { PostAddDialog } from "../feature/post/ui/PostAddDialog"
import { PostEditDialog } from "../feature/post/ui/PostEditDialog"
import { PostDetailDialog } from "../feature/post/ui/PostDetailDialog"
import { PostUserDialog } from "../feature/post/ui/PostUserDialog"
import { Pagination } from "../widgets"
import PostSearchFilter from "../feature/post/ui/PostSearchFilter"
import { PostHeader } from "../feature/post/ui/PostHeader"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<Array<Post>>([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [selectedPost, setSelectedPost] = useState<Post>(INIT_POST)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<Tags>([])
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [comments, setComments] = useState<{ [key: number]: Array<Comment> }>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<NewComment>({ body: "", postId: 0, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

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
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
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
      const { result, comments: commentData } = await getComments(postId)
      if (result && commentData) {
        setComments((prev) => ({ ...prev, [postId]: commentData.comments }))
      }
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
    try {
      const response = await fetch(`/api/comments/${selectedComment?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment?.body }),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  const handleChangeTag = (value: string) => {
    setSelectedTag(value)
    fetchPostsByTag(value)
    updateURL()
  }

  const handleSearchPost = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchPosts()
    }
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

  const commentsProps = {
    postId: selectedPost?.id,
    searchQuery,
    setNewComment,
    setComments,
    setShowAddCommentDialog,
    comments,
    setSelectedComment,
    setShowEditCommentDialog,
  }

  const commentAddProps = {
    showAddCommentDialog,
    setShowAddCommentDialog,
    newComment,
    setNewComment,
    addComment,
  }

  const commentEditProps = {
    showEditCommentDialog,
    setShowEditCommentDialog,
    selectedComment: selectedComment as Comment,
    setSelectedComment,
    updateComment,
  }

  const postAddProps = {
    showAddDialog,
    setShowAddDialog,
    newPost,
    setNewPost,
    addPost,
  }

  const postEidtProps = {
    showEditDialog,
    setShowEditDialog,
    selectedPost,
    setSelectedPost,
    updatePost,
  }

  const postDetailProps = {
    showPostDetailDialog,
    setShowPostDetailDialog,
    selectedPost,
    ...commentsProps,
  }

  const postUserProps = {
    showUserModal,
    setShowUserModal,
    selectedUser: selectedUser as User,
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
    <Card className="w-full max-w-6xl mx-auto">
      <PostHeader setShowAddDialog={setShowAddDialog} />
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

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog {...postAddProps}></PostAddDialog>

      {/* 게시물 수정 대화상자 */}
      <PostEditDialog {...postEidtProps} />

      {/* 댓글 추가 대화상자 */}
      <CommentAddDialog {...commentAddProps} />

      {/* 댓글 수정 대화상자 */}
      <CommentEditDialog {...commentEditProps} />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog {...postDetailProps}>
        <Comments {...commentsProps} /> 
      </PostDetailDialog>

      {/* 사용자 모달 */}
      <PostUserDialog {...postUserProps} />
    </Card>
  )
}

export default PostsManager
