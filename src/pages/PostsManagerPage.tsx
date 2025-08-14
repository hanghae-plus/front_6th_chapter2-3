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
} from "../shared/ui"
import { HighlightText } from "../shared/ui/HighlightText"
import { PostsTable } from "../widgets/posts-table/ui/PostsTable"
import { useFetchPostsByMode } from "../features/posts/fetch-posts-by-mode/useFetchPostsByMode.ts"
import { useSearchMode } from "../features/posts/fetch-posts-by-mode/search-mode/useSearchMode"
import { useTagMode } from "../features/posts/fetch-posts-by-mode/tag-mode/useTagMode.ts"
import { useTagsQuery } from "../entities/post/hook.ts"
import { usePageNavigateMode } from "../features/posts/fetch-posts-by-mode/page-navigate-mode/usePageNavigateMode.ts"
import { useSortMode } from "../features/posts/fetch-posts-by-mode/sort-mode/useSortMode.ts"
import { useAddPost } from "../features/posts/add-post/useAddPost.ts"
import { useUpdatePost } from "../features/posts/update-post/useUpdatePost.ts"
import { useDetailPost } from "../features/posts/detail-post/useDetailPost.ts"
import { useDeletePost } from "../features/posts/delete-post/useDeletePost.ts"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  // const url = useUpdateURL()
  // const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  // const [selectedPost, setSelectedPost] = useState(null)
  // const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  // const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  // const [showAddDialog, setShowAddDialog] = useState(false)
  // const [showEditDialog, setShowEditDialog] = useState(false)
  // const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })

  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  // const [comments, setComments] = useState({})
  const [selectedComment, setSelectedComment] = useState(null)
  const [newComment, setNewComment] = useState({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  // const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    // if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    // if (searchQuery) params.set("search", searchQuery)
    // if (sortBy) params.set("sortBy", sortBy)
    // if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  const { posts, total, isLoading: loading } = useFetchPostsByMode()
  const searchMode = useSearchMode()
  const tagMode = useTagMode()
  const { data: tags } = useTagsQuery()
  const pageNavigateMode = usePageNavigateMode()
  const sortMode = useSortMode()

  const addPost = useAddPost()
  const updatePost = useUpdatePost()
  const detailPost = useDetailPost()
  const deletePost = useDeletePost()

  // 게시물 업데이트
  // const updatePost = async () => {
  //   try {
  //     const response = await fetch(`/api/posts/${selectedPost.id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(selectedPost),
  //     })
  //     const data = await response.json()
  //     // setPosts(posts.map((post) => (post.id === data.id ? data : post)))
  //     setShowEditDialog(false)
  //   } catch (error) {
  //     console.error("게시물 업데이트 오류:", error)
  //   }
  // }

  // 게시물 삭제
  // const deletePost = async (id) => {
  //   try {
  //     await fetch(`/api/posts/${id}`, {
  //       method: "DELETE",
  //     })
  //     // setPosts(posts.filter((post) => post.id !== id))
  //   } catch (error) {
  //     console.error("게시물 삭제 오류:", error)
  //   }
  // }

  // 댓글 가져오기
  const fetchComments = async (postId) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data = await response.json()
      console.log("댓글가져오기", data)
      // setComments((prev) => ({ ...prev, [postId]: data.comments }))
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
      // setComments((prev) => ({
      //   ...prev,
      //   [data.postId]: [...(prev[data.postId] || []), data],
      // }))
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
      // setComments((prev) => ({
      //   ...prev,
      //   [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      // }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id, postId) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      // setComments((prev) => ({
      //   ...prev,
      //   [postId]: prev[postId].filter((comment) => comment.id !== id),
      // }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id, postId) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: comments[postId].find((c) => c.id === id).likes + 1 }),
      })
      const data = await response.json()
      // setComments((prev) => ({
      //   ...prev,
      //   [postId]: prev[postId].map((comment) =>
      //     comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
      //   ),
      // }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
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

  // 태그 가져오기
  // useEffect(() => {
  //   fetchTags()
  // }, [])

  // URL 파라미터 가져오기
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    // setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    // setSortBy(params.get("sortBy") || "")
    // setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // 댓글 렌더링
  const renderComments = (postId) => {
    console.log("댓글 렌더링", postId)
    // console.log(comments)
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2 ">
          <h3 className="text-sm font-semibold">댓글</h3>
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
        <div className="space-y-1">
          {detailPost.state.comments?.map((comment) => (
            <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="font-medium truncate">{comment.user.username}:</span>
                {/* <span className="truncate">{highlightText(comment.body, searchQuery)}</span> */}
                <span className="truncate">
                  <HighlightText text={comment.body} highlight={searchQuery} />
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                  <ThumbsUp className="w-3 h-3" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>
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
                <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => addPost.modal.open()}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchMode.value}
                  onChange={(e) => searchMode.change(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchMode.update(searchMode.value)}
                />
              </div>
            </div>
            <Select
              value={tagMode.param}
              onValueChange={(value) => {
                tagMode.update(value)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags?.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sortMode.param.sortBy}
              onValueChange={(value) => sortMode.update(value, sortMode.param.order)}
            >
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
            <Select
              value={sortMode.param.order}
              onValueChange={(value) => sortMode.update(sortMode.param.sortBy, value)}
            >
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
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              data={{
                rows: posts,
                searchQuery,
                selectedTag,
              }}
              handlers={{
                onTagClick: (tag) => {
                  setSelectedTag(tag)
                  // fetchPostsByTag(tag)
                  updateURL()
                },
                onOpenDetail: (post) => detailPost.actions.detail(post),
                onEdit: (post) => updatePost.action.edit(post),
                onDelete: (id) => deletePost.action.delete(id),
                onAuthorClick: (author) => author && openUserModal(author),
              }}
            />
          )}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
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
            <div className="flex gap-2">
              <Button disabled={pageNavigateMode.state.prevDisabled} onClick={() => pageNavigateMode.action.prevPage()}>
                이전
              </Button>
              <Button disabled={pageNavigateMode.state.nextDisabled} onClick={() => pageNavigateMode.action.nextPage()}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <Dialog
        open={addPost.modal.isOpen}
        onOpenChange={(open) => (open ? addPost.modal.open() : addPost.modal.close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={addPost.state.newPost.title}
              onChange={(e) => addPost.actions.change("title", e.target.value)}
            />
            <Textarea
              rows={30}
              placeholder="내용"
              value={addPost.state.newPost.body}
              onChange={(e) => addPost.actions.change("body", e.target.value)}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={addPost.state.newPost.userId}
              onChange={(e) => addPost.actions.change("userId", Number(e.target.value))}
            />
            <Button onClick={() => addPost.actions.add(addPost.state.newPost)}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog
        open={updatePost.modal.isOpen}
        onOpenChange={(open) => (open ? updatePost.modal.open() : updatePost.modal.close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={updatePost.state.selectedPost?.title || ""}
              onChange={(e) => updatePost.action.change("title", e.target.value)}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={updatePost.state.selectedPost?.body || ""}
              onChange={(e) => updatePost.action.change("body", e.target.value)}
            />
            <Button onClick={() => updatePost.action.update(updatePost.state.selectedPost!)}>게시물 업데이트</Button>
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
      <Dialog
        open={detailPost.modal.isOpen}
        onOpenChange={(open) => (open ? detailPost.modal.open() : detailPost.modal.close())}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              <HighlightText text={detailPost.state.selectedPost?.title || ""} highlight={searchQuery} />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <HighlightText text={detailPost.state.selectedPost?.body || ""} highlight={searchQuery} />
            </p>
            {renderComments(detailPost.state.selectedPost?.id || 0)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img src={selectedUser?.image} alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
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
