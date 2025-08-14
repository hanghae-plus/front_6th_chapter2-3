import { useEffect, useState, memo, useCallback } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"

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
import { useGetComments } from "../features/comment/get-comments/hooks"
import { useDeleteCommentFeature } from "../features/comment/del-comments/hooks"
import { useLikeCommentFeature } from "../features/comment/like-comments/hooks"
import { useAddComment } from "../features/comment/add-comments/hooks"
import { Edit2, ThumbsUp, Trash2 } from "lucide-react"

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

// 댓글 목록 컴포넌트
const CommentSection = memo(
  ({
    postId,
    onAddComment,
    onEditComment,
  }: {
    postId: number
    onAddComment: () => void
    onEditComment: (comment: Comment) => void
  }) => {
    const { comments } = useGetComments(postId)
    const { deleteComment, isLoading: isDeleting } = useDeleteCommentFeature()
    const { likeComment, isLoading: isLiking } = useLikeCommentFeature()
    const queryClient = useQueryClient()

    console.log("CommentSection 렌더링:", { postId, commentsCount: comments.length, isDeleting, isLiking })

    const handleDeleteComment = async (id: number) => {
      console.log("댓글 삭제 시도:", id)
      const result = await deleteComment(id)
      console.log("댓글 삭제 결과:", result)
      if (result.success) {
        console.log("댓글 삭제 성공!")

        // setQueryData를 사용하여 댓글 캐시에서 삭제된 댓글 제거
        queryClient.setQueryData(["comments", postId], (oldData: { comments: Comment[] } | undefined) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            comments: oldData.comments.filter((comment: Comment) => comment.id !== id),
          }
        })
      } else {
        console.error("댓글 삭제 실패:", result.error)
      }
    }

    const handleLikeComment = async (id: number) => {
      console.log("댓글 좋아요 시도:", id)
      const result = await likeComment(id)
      console.log("댓글 좋아요 결과:", result)
      if (result.success) {
        console.log("댓글 좋아요 성공!")

        // setQueryData를 사용하여 댓글 캐시에서 좋아요 수 증가
        queryClient.setQueryData(["comments", postId], (oldData: { comments: Comment[] } | undefined) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            comments: oldData.comments.map((comment: Comment) =>
              comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment,
            ),
          }
        })
      } else {
        console.error("댓글 좋아요 실패:", result.error)
      }
    }

    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">댓글</h3>
          <Button size="sm" onClick={onAddComment}>
            <Plus className="w-3 h-3 mr-1" />
            댓글 추가
          </Button>
        </div>
        <div className="space-y-1">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="font-medium truncate">{comment.user.username}:</span>
                <span className="truncate">{comment.body}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id)} disabled={isLiking}>
                  <ThumbsUp className="w-3 h-3" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)} disabled={isDeleting}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
)

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const queryClient = useQueryClient()

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

  // 댓글 추가 훅 사용
  const { addComment: addCommentMutation, isLoading: isAddingComment } = useAddComment()

  // 댓글 관련 콜백 함수들 메모이제이션
  const handleAddComment = useCallback(() => {
    if (selectedPost?.id) {
      setNewComment({ body: "", postId: selectedPost.id, userId: 1 })
      openAddCommentDialog()
    }
  }, [selectedPost?.id, openAddCommentDialog])

  const handleEditComment = useCallback(
    (comment: Comment) => {
      setSelectedComment(comment)
      openEditCommentDialog()
    },
    [openEditCommentDialog],
  )

  // 댓글 추가
  const addComment = async () => {
    console.log("댓글 추가 시도:", newComment)

    if (!newComment.body.trim() || !newComment.postId) {
      console.error("댓글 내용이나 게시물 ID가 없습니다.")
      return
    }

    try {
      // 낙관적 업데이트: 댓글 추가 전에 임시 댓글을 UI에 표시
      const tempComment: Comment = {
        id: Date.now(), // 임시 ID
        body: newComment.body,
        postId: newComment.postId,
        likes: 0,
        user: {
          id: newComment.userId,
          username: "사용자",
          fullName: "사용자",
        },
      }

      // 임시 댓글을 캐시에 추가
      queryClient.setQueryData(["comments", newComment.postId], (oldData: { comments: Comment[] } | undefined) => {
        if (!oldData) return { comments: [tempComment] }

        return {
          ...oldData,
          comments: [...oldData.comments, tempComment],
        }
      })

      const result = (await addCommentMutation({
        body: newComment.body,
        postId: newComment.postId,
        userId: newComment.userId,
      })) as { success: boolean; data?: Comment; error?: unknown }

      if (result.success) {
        console.log("댓글 추가 성공!")
        closeAddCommentDialog()
        setNewComment({ body: "", postId: null, userId: 1 })

        // API 재호출 없이 setQueryData로 실제 댓글 데이터로 업데이트
        if (newComment.postId) {
          queryClient.setQueryData(["comments", newComment.postId], (oldData: { comments: Comment[] } | undefined) => {
            if (!oldData) return oldData

            // 임시 댓글을 실제 댓글 데이터로 교체
            return {
              ...oldData,
              comments: oldData.comments.map((comment) =>
                comment.id === tempComment.id
                  ? { ...comment, id: result.data?.id || comment.id } // 실제 ID로 교체
                  : comment,
              ),
            }
          })
        }
      } else {
        console.error("댓글 추가 실패:", result.error)

        // 실패 시 임시 댓글 제거
        queryClient.setQueryData(["comments", newComment.postId], (oldData: { comments: Comment[] } | undefined) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            comments: oldData.comments.filter((comment) => comment.id !== tempComment.id),
          }
        })
      }
    } catch (error) {
      console.error("댓글 추가 오류:", error)

      // 에러 시에도 임시 댓글 제거
      if (newComment.postId) {
        queryClient.setQueryData(["comments", newComment.postId], (oldData: { comments: Comment[] } | undefined) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            comments: oldData.comments.filter((comment) => comment.id !== Date.now()),
          }
        })
      }
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    console.log("댓글 수정 시도:", selectedComment)
    try {
      if (!selectedComment) return

      // 댓글 수정 API 호출
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })

      if (response.ok) {
        console.log("댓글 수정 성공!")

        // setQueryData를 사용하여 댓글 캐시만 직접 업데이트 (API 재호출 없음)
        if (selectedPost?.id) {
          queryClient.setQueryData(["comments", selectedPost.id], (oldData: { comments: Comment[] } | undefined) => {
            if (!oldData) return oldData

            return {
              ...oldData,
              comments: oldData.comments.map((comment: Comment) =>
                comment.id === selectedComment.id ? { ...comment, body: selectedComment.body } : comment,
              ),
            }
          })
        }

        closeEditCommentDialog()
      } else {
        console.error("댓글 수정 실패:", response.statusText)
      }
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: PostWithAuthor) => {
    console.log("openPostDetail 호출됨:", post)
    setSelectedPost(post)
    openPostDetailDialog()
    console.log("showPostDetailDialog 상태:", showPostDetailDialog)
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

  // 디버깅을 위한 상태 변화 추적
  useEffect(() => {
    console.log("showPostDetailDialog 상태 변화:", showPostDetailDialog)
  }, [showPostDetailDialog])

  useEffect(() => {
    console.log("selectedPost 상태 변화:", selectedPost)
  }, [selectedPost])

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
            <Button onClick={addComment} disabled={isAddingComment}>
              {isAddingComment ? "추가 중..." : "댓글 추가"}
            </Button>
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
              onChange={(e) => selectedComment && setSelectedComment({ ...selectedComment, body: e.target.value })}
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
            {selectedPost?.id && (
              <CommentSection
                postId={selectedPost.id}
                onAddComment={handleAddComment}
                onEditComment={handleEditComment}
              />
            )}
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
