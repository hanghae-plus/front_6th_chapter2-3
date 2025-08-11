import { useEffect, useState } from "react"
import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/components"

/**
 * 게시물 관리자 컴포넌트
 * 게시물의 CRUD 작업, 댓글 관리, 사용자 정보 조회 등을 담당
 */
const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // ===== 상태 관리 =====
  // 게시물 관련 상태
  const [posts, setPosts] = useState([]) // 게시물 목록
  const [total, setTotal] = useState(0) // 전체 게시물 수
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0")) // 페이지네이션 시작 인덱스
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10")) // 페이지당 게시물 수

  // 검색 및 필터링 상태
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "") // 검색어
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "") // 정렬 기준
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc") // 정렬 순서
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "") // 선택된 태그

  // 선택된 항목 상태
  const [selectedPost, setSelectedPost] = useState(null) // 선택된 게시물
  const [selectedComment, setSelectedComment] = useState(null) // 선택된 댓글
  const [selectedUser, setSelectedUser] = useState(null) // 선택된 사용자

  // 대화상자 표시 상태
  const [showAddDialog, setShowAddDialog] = useState(false) // 게시물 추가 대화상자
  const [showEditDialog, setShowEditDialog] = useState(false) // 게시물 수정 대화상자
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false) // 댓글 추가 대화상자
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false) // 댓글 수정 대화상자
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false) // 게시물 상세 보기 대화상자
  const [showUserModal, setShowUserModal] = useState(false) // 사용자 정보 모달

  // 데이터 상태
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 }) // 새 게시물 데이터
  const [newComment, setNewComment] = useState({ body: "", postId: null, userId: 1 }) // 새 댓글 데이터
  const [loading, setLoading] = useState(false) // 로딩 상태
  const [tags, setTags] = useState([]) // 태그 목록
  const [comments, setComments] = useState({}) // 댓글 목록 (게시물 ID별로 그룹화)

  // ===== URL 업데이트 함수 =====
  /**
   * 현재 상태를 URL 쿼리 파라미터로 업데이트
   * 페이지 새로고침 시에도 상태 유지
   */
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

  // ===== 게시물 관련 함수들 =====
  /**
   * 게시물 목록을 가져오는 함수
   * 게시물과 사용자 정보를 함께 가져와서 조합
   */
  const fetchPosts = () => {
    setLoading(true)
    let postsData
    let usersData

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        postsData = data
        return fetch("/api/users?limit=0&select=username,image")
      })
      .then((response) => response.json())
      .then((users) => {
        usersData = users.users
        // 게시물에 작성자 정보 추가
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

  /**
   * 태그 목록을 가져오는 함수
   */
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  /**
   * 게시물 검색 함수
   * 검색어가 없으면 전체 게시물을 가져옴
   */
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

  /**
   * 특정 태그로 게시물을 가져오는 함수
   * @param tag - 검색할 태그
   */
  const fetchPostsByTag = async (tag) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      // 게시물과 사용자 정보를 병렬로 가져옴
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch("/api/users?limit=0&select=username,image"),
      ])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()

      // 게시물에 작성자 정보 추가
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

  /**
   * 새 게시물을 추가하는 함수
   */
  const addPost = async () => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      const data = await response.json()
      setPosts([data, ...posts]) // 새 게시물을 목록 맨 앞에 추가
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  /**
   * 게시물을 수정하는 함수
   */
  const updatePost = async () => {
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      })
      const data = await response.json()
      // 수정된 게시물로 목록 업데이트
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  /**
   * 게시물을 삭제하는 함수
   * @param id - 삭제할 게시물 ID
   */
  const deletePost = async (id) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      // 삭제된 게시물을 목록에서 제거
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // ===== 댓글 관련 함수들 =====
  /**
   * 특정 게시물의 댓글을 가져오는 함수
   * 이미 불러온 댓글이 있으면 다시 불러오지 않음
   * @param postId - 게시물 ID
   */
  const fetchComments = async (postId) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data = await response.json()
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  /**
   * 새 댓글을 추가하는 함수
   */
  const addComment = async () => {
    try {
      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
      const data = await response.json()
      // 새 댓글을 해당 게시물의 댓글 목록에 추가
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

  /**
   * 댓글을 수정하는 함수
   */
  const updateComment = async () => {
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data = await response.json()
      // 수정된 댓글으로 목록 업데이트
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  /**
   * 댓글을 삭제하는 함수
   * @param id - 삭제할 댓글 ID
   * @param postId - 댓글이 속한 게시물 ID
   */
  const deleteComment = async (id, postId) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      // 삭제된 댓글을 목록에서 제거
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  /**
   * 댓글에 좋아요를 추가하는 함수
   * @param id - 댓글 ID
   * @param postId - 댓글이 속한 게시물 ID
   */
  const likeComment = async (id, postId) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: comments[postId].find((c) => c.id === id).likes + 1 }),
      })
      const data = await response.json()
      // 좋아요 수를 증가시켜 댓글 목록 업데이트
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // ===== UI 관련 함수들 =====
  /**
   * 게시물 상세 보기 대화상자를 여는 함수
   * @param post - 상세 보기할 게시물
   */
  const openPostDetail = (post) => {
    setSelectedPost(post)
    fetchComments(post.id) // 댓글도 함께 가져옴
    setShowPostDetailDialog(true)
  }

  /**
   * 사용자 정보 모달을 여는 함수
   * @param user - 정보를 조회할 사용자
   */
  const openUserModal = async (user) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  // ===== useEffect 훅들 =====
  // 컴포넌트 마운트 시 태그 목록 가져오기
  useEffect(() => {
    fetchTags()
  }, [])

  // 페이지네이션, 정렬, 태그 변경 시 게시물 다시 가져오기
  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  // URL 쿼리 파라미터 변경 시 상태 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // ===== 유틸리티 함수들 =====
  /**
   * 텍스트에서 검색어를 하이라이트하는 함수
   * @param text - 원본 텍스트
   * @param highlight - 하이라이트할 검색어
   * @returns 하이라이트된 JSX 요소
   */
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

  // ===== 렌더링 함수들 =====
  /**
   * 게시물 테이블을 렌더링하는 함수
   * 게시물 목록을 테이블 형태로 표시
   */
  const renderPostTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                {/* 제목에 검색어 하이라이트 적용 */}
                <div>{highlightText(post.title, searchQuery)}</div>

                {/* 태그 목록 표시 */}
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSelectedTag(tag)
                        updateURL()
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            {/* 작성자 정보 - 클릭 시 사용자 모달 열기 */}
            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(post.author)}>
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            {/* 게시물 반응 (좋아요/싫어요) 표시 */}
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            {/* 게시물 작업 버튼들 */}
            <TableCell>
              <div className="flex items-center gap-2">
                {/* 댓글 보기 버튼 */}
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                {/* 수정 버튼 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                {/* 삭제 버튼 */}
                <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  /**
   * 댓글 목록을 렌더링하는 함수
   * @param postId - 댓글을 표시할 게시물 ID
   */
  const renderComments = (postId) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        {/* 댓글 추가 버튼 */}
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }))
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      {/* 댓글 목록 */}
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            {/* 댓글 작업 버튼들 */}
            <div className="flex items-center space-x-1">
              {/* 좋아요 버튼 */}
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              {/* 수정 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              {/* 삭제 버튼 */}
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ===== 메인 렌더링 =====
  return (
    <Card className="w-full max-w-6xl mx-auto">
      {/* 카드 헤더 - 제목과 게시물 추가 버튼 */}
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
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            {/* 검색 입력창 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchPosts()}
                />
              </div>
            </div>
            {/* 태그 선택 드롭다운 */}
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
                fetchPostsByTag(value)
                updateURL()
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* 정렬 기준 선택 */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            {/* 정렬 순서 선택 */}
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 컨트롤 */}
          <div className="flex justify-between items-center">
            {/* 페이지당 항목 수 선택 */}
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            {/* 이전/다음 페이지 버튼 */}
            <div className="flex gap-2">
              <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
                이전
              </Button>
              <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* ===== 대화상자들 ===== */}

      {/* 게시물 추가 대화상자 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={30}
              placeholder="내용"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={newPost.userId}
              onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            />
            <Button onClick={addPost}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ""}
              onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />
            <Button onClick={addComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body, searchQuery)}</p>
            {renderComments(selectedPost?.id)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 정보 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 사용자 프로필 이미지 */}
            <img src={selectedUser?.image} alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
            {/* 사용자 상세 정보 */}
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
                {selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser?.company?.name} - {selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
