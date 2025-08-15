import { useEffect, useState, useCallback } from "react"
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
import { useAddComment } from "../features/comment/add-comments/hooks"
import { useCurrentUser } from "../entities/user/model/hooks"
import { CommentAddForm, CommentEditForm, PostDetailDialog, UserInfoModal, Pagination } from "../widget"
import { useUpdateCommentFeature } from "../features/comment/update-comments/hooks"

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
  const queryClient = useQueryClient()

  // 현재 사용자 정보 가져오기
  const { data: currentUser } = useCurrentUser()

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
  const [searchInputValue, setSearchInputValue] = useState(queryParams.get("search") || "")
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<CommentForm>({ body: "", postId: null, userId: 1 })
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

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
    if (!searchInputValue) return
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
    if (!newComment.body.trim() || !newComment.postId) {
      console.error("댓글 내용이나 게시물 ID가 없습니다.")
      return
    }

    if (!currentUser) {
      console.error("사용자 정보를 가져올 수 없습니다.")
      return
    }

    try {
      // 낙관적 업데이트: 댓글 추가 전에 임시 댓글을 UI에 표시
      const tempComment: Comment = {
        id: Date.now(),
        body: newComment.body,
        postId: newComment.postId,
        likes: 0,
        user: {
          id: currentUser.id,
          username: currentUser.username,
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
        userId: currentUser.id, // currentUser.id 사용
      })) as { success: boolean; data?: Comment; error?: unknown }

      if (result.success) {
        closeAddCommentDialog()
        setNewComment({ body: "", postId: null, userId: 1 })

        // API 재호출 없이 setQueryData로 실제 댓글 데이터로 업데이트
        if (newComment.postId) {
          queryClient.setQueryData(["comments", newComment.postId], (oldData: { comments: Comment[] } | undefined) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              comments: oldData.comments.map((comment) =>
                comment.id === tempComment.id ? { ...comment, id: result.data?.id || comment.id } : comment,
              ),
            }
          })
        }
      } else {
        console.error("댓글 추가 실패:", result.error)
        // 실패 시 임시 댓글 제거
        removeTempComment(tempComment.id)
      }
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      removeTempComment(Date.now())
    }
  }

  // 임시 댓글 제거 헬퍼 함수
  const removeTempComment = (tempId: number) => {
    if (newComment.postId) {
      queryClient.setQueryData(["comments", newComment.postId], (oldData: { comments: Comment[] } | undefined) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          comments: oldData.comments.filter((comment) => comment.id !== tempId),
        }
      })
    }
  }

  // ✅ 올바른 훅 사용
  const { updateComment: updateCommentMutation } = useUpdateCommentFeature()

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment) return

    try {
      const result = await updateCommentMutation(
        selectedComment.id,
        { body: selectedComment.body },
        selectedPost?.id || 0,
      )

      if (result.success) {
        // setQueryData를 사용하여 댓글 캐시만 직접 업데이트
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
        console.error("댓글 수정 실패:", result.error)
      }
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: PostWithAuthor) => {
    setSelectedPost(post)
    openPostDetailDialog()
  }

  // 사용자 모달 열기
  const handleOpenUserModal = (user: User) => {
    // 사용자 ID를 직접 전달
    setSelectedUserId(user.id)
    openUserModal()
  }

  // 페이지네이션 핸들러
  const handleSkipChange = (newSkip: number) => {
    setSkip(newSkip)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setSkip(0) // 페이지 크기 변경 시 첫 페이지로 이동
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
              setSkip(0)
            }}
            onSortByChange={(value) => {
              setSortBy(value)
              setSkip(0)
            }}
            onSortOrderChange={(value) => {
              setSortOrder(value)
              setSkip(0)
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
          <Pagination
            skip={skip}
            limit={limit}
            total={total}
            onSkipChange={handleSkipChange}
            onLimitChange={handleLimitChange}
          />
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
          <CommentAddForm
            comment={newComment}
            onCommentChange={setNewComment}
            onSubmit={addComment}
            isLoading={isAddingComment}
          />
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
          {/* ✅ 에러 메시지 표시 */}
          {/* {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
          )} */}
          <CommentEditForm comment={selectedComment} onCommentChange={setSelectedComment} onSubmit={updateComment} />
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={(open) => {
          if (open) {
            openPostDetailDialog()
          } else {
            closePostDetailDialog()
          }
        }}
        post={selectedPost}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
      />

      {/* 사용자 모달 */}
      <UserInfoModal
        open={showUserModal}
        onOpenChange={(open) => {
          if (open) {
            openUserModal()
          } else {
            closeUserModal()
          }
        }}
        userId={selectedUserId}
      />
    </Card>
  )
}

export default PostsManager
