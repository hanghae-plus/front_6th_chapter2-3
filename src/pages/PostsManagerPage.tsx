import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "../shared/ui"
import { useGetPosts } from "../features/post/get-posts/hooks"
import { useDeletePost } from "../entities/post/model/hooks"
import { useDialogStore } from "../shared/stores/dialogStore"
import { PostTable } from "../widget/post-table/PostTable"
import { PostFilter } from "../widget/post-filter/PostFilter"
import { AddPostForm } from "../features/post/add-posts/AddPostForm"
import { UpdatePostForm } from "../features/post/update-posts/UpdatePostForm"
import { PostItem } from "../entities/post/model/types"
import { User } from "../entities/user/model/types"
import { Comment } from "../entities/comment/model/types"
import { CommentList } from "../widget/comment-list/CommentList"

// PostItem에 author 속성이 추가된 타입
interface PostWithAuthor extends PostItem {
  author?: User
}

// 댓글 입력 폼 타입
interface CommentForm {
  body: string
  postId: number | null
  userId: number
}

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // Zustand store 사용
  const {
    showAddDialog,
    showEditDialog,
    showAddCommentDialog,
    showEditCommentDialog,
    showPostDetailDialog,
    showUserModal,
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,
    openAddCommentDialog,
    closeAddCommentDialog,
    openEditCommentDialog,
    closeEditCommentDialog,
    openPostDetailDialog,
    closePostDetailDialog,
    openUserModal,
    closeUserModal,
  } = useDialogStore()

  // 상태 관리
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [searchInputValue, setSearchInputValue] = useState(queryParams.get("search") || "") // 검색 입력값을 별도로 관리
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<CommentForm>({ body: "", postId: null, userId: 1 })
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

  const { posts, total, loading } = useGetPosts(limit, skip, sortBy, sortOrder, selectedTag, searchQuery)

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchInputValue) {
      return
    }

    setSearchQuery(searchInputValue)
    setSelectedTag("")
    setSkip(0)
  }

  // 게시물 삭제 훅 사용
  const deletePostMutation = useDeletePost()

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await deletePostMutation.mutateAsync(id)
      // 캐시 업데이트는 useDeletePost 훅에서 자동으로 처리됨
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
    try {
      // createComment
      await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
      closeAddCommentDialog()
      setNewComment({ body: "", postId: null, userId: 1 })
      // 댓글 추가 후 상세 보기 새로고침 (React Query가 자동으로 처리)
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    try {
      if (!selectedComment) return

      await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      closeEditCommentDialog()
      // 댓글 업데이트 후 상세 보기 새로고침 (React Query가 자동으로 처리)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id: number) => {
    try {
      // deleteComment
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      // 댓글 삭제 후 상세 보기 새로고침 (React Query가 자동으로 처리)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: number) => {
    try {
      // likeComment
      await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: 1 }),
      })
      // 댓글 좋아요 후 상세 보기 새로고침 (React Query가 자동으로 처리)
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: PostWithAuthor) => {
    setSelectedPost(post)
    openPostDetailDialog()
  }

  // 사용자 모달 열기
  const handleOpenUserModal = async (user: User) => {
    try {
      // getUserInfo
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      openUserModal()
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag, searchQuery])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  const renderComments = (postId: number) => {
    return (
      <CommentList
        postId={postId}
        onAddComment={() => {
          setNewComment((prev) => ({ ...prev, postId }))
          openAddCommentDialog()
        }}
        onEditComment={(comment) => {
          setSelectedComment(comment)
          openEditCommentDialog()
        }}
        onDeleteComment={deleteComment}
        onLikeComment={likeComment}
      />
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostFilter
            searchInputValue={searchInputValue}
            selectedTag={selectedTag}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchInputChange={setSearchInputValue}
            onSelectedTagChange={(value) => {
              setSelectedTag(value)
              setSearchQuery("")
              setSkip(0) // 태그 변경 시 첫 페이지로 이동
            }}
            onSortByChange={(value) => {
              setSortBy(value)
              setSkip(0) // 정렬 변경 시 첫 페이지로 이동
            }}
            onSortOrderChange={(value) => {
              setSortOrder(value)
              setSkip(0) // 정렬 순서 변경 시 첫 페이지로 이동
            }}
            onSearch={searchPosts}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              updateURL={updateURL}
              openUserModal={handleOpenUserModal}
              openPostDetail={openPostDetail}
              setSelectedPost={setSelectedPost}
              setShowEditDialog={(post: PostWithAuthor) => {
                setSelectedPost(post)
                openEditDialog()
              }}
              deletePost={deletePost}
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

      {/* 게시물 추가 대화상자 */}
      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          if (open) {
            openAddDialog()
          } else {
            closeAddDialog()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 추가</DialogTitle>
          </DialogHeader>
          <AddPostForm />
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          if (open) {
            openEditDialog()
          } else {
            closeEditDialog()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          {selectedPost && <UpdatePostForm selectedPost={selectedPost as PostItem} />}
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog
        open={showAddCommentDialog}
        onOpenChange={(open) => {
          if (open) {
            openAddCommentDialog()
          } else {
            closeAddCommentDialog()
          }
        }}
      >
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
      <Dialog
        open={showEditCommentDialog}
        onOpenChange={(open) => {
          if (open) {
            openEditCommentDialog()
          } else {
            closeEditCommentDialog()
          }
        }}
      >
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
        open={showPostDetailDialog}
        onOpenChange={(open) => {
          if (open) {
            openPostDetailDialog()
          } else {
            closePostDetailDialog()
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{selectedPost?.body}</p>
            {renderComments(selectedPost?.id)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog
        open={showUserModal}
        onOpenChange={(open) => {
          if (open) {
            openUserModal()
          } else {
            closeUserModal()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img src={selectedUser?.image} alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
            <div className="space-y-2">
              <p>
                <strong>사용자 ID:</strong> {selectedUser?.id}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
