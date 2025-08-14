import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTagStore } from "../../entities/tag/model/store"
import { useUserStore } from "../../entities/user/model/store"
import { usePostsUI } from "./ui"
import { usePosts, useAddPost, useUpdatePost, useDeletePost } from "../../entities/post/model/queries"
import { useCommentMutations } from "./commentMutations"

// 게시물 관리 통합 비즈니스 로직
export const usePostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // UI 상태
  const ui = usePostsUI()

  // 페이지네이션 상태
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  
  // 검색 상태
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>("")

  // 스토어
  const { tags, selectedTag, fetchTags, setSelectedTag } = useTagStore()
  const { fetchUser, selectedUser } = useUserStore()

  // TanStack Query hooks
  const addPostMutation = useAddPost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()

  // 게시물 데이터 조회
  const { data: postsData, isLoading: postsLoading } = usePosts(limit, skip, activeSearchQuery || undefined, selectedTag)

  const posts = postsData?.posts || []
  const total = postsData?.total || 0
  const loading = postsLoading

  // 댓글 관련 mutations (항상 생성하되, postId는 0으로 초기화)
  const commentMutations = useCommentMutations(selectedPost?.id || 0)

  // URL 상태 동기화
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (ui.searchQuery) params.set("search", ui.searchQuery)
    if (ui.sortBy) params.set("sortBy", ui.sortBy)
    if (ui.sortOrder) params.set("sortOrder", ui.sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  // URL에서 상태 복원
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    const searchQuery = params.get("search") || ""
    ui.setSearchQuery(searchQuery)
    setActiveSearchQuery(searchQuery)
    ui.setSortBy(params.get("sortBy") || "")
    ui.setSortOrder(params.get("sortOrder") || "asc")
  }, [location.search])

  // 초기화
  useEffect(() => {
    fetchTags()
  }, [])

  // URL 업데이트
  useEffect(() => {
    updateURL()
  }, [skip, limit, ui.sortBy, ui.sortOrder, selectedTag])

  // 비즈니스 로직
  const handleAddPost = async () => {
    try {
      await addPostMutation.mutateAsync(ui.newPost)
      ui.closeAddPostDialog()
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const handleUpdatePost = async () => {
    if (!selectedPost) return
    try {
      await updatePostMutation.mutateAsync({
        id: selectedPost.id,
        updateData: {
          title: selectedPost.title,
          body: selectedPost.body,
        },
      })
      ui.closeEditPostDialog()
    } catch (error) {
      console.error("게시물 수정 오류:", error)
    }
  }

  const handleDeletePost = async (id: number) => {
    try {
      await deletePostMutation.mutateAsync(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  const handleAddComment = async () => {
    if (!selectedPost) return
    try {
      const commentData = {
        ...ui.newComment,
        postId: selectedPost.id
      }
      await commentMutations.addCommentMutation.mutateAsync(commentData)
      ui.closeAddCommentDialog()
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const handleUpdateComment = async () => {
    if (!ui.selectedComment) return
    try {
      await commentMutations.updateCommentMutation.mutateAsync({
        id: ui.selectedComment.id,
        updateData: { body: ui.selectedComment.body },
      })
      ui.closeEditCommentDialog()
    } catch (error) {
      console.error("댓글 수정 오류:", error)
    }
  }

  const handleDeleteComment = async (commentId: number, postId: number) => {
    try {
      // 현재 selectedPost와 같은 postId인 경우에만 삭제
      if (selectedPost?.id === postId) {
        await commentMutations.deleteCommentMutation.mutateAsync({ commentId })
      } else {
        console.warn("다른 게시물의 댓글을 삭제하려고 시도했습니다:", postId)
      }
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const handleLikeComment = async (commentId: number) => {
    try {
      await commentMutations.likeCommentMutation.mutateAsync({ id: commentId })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  const handleSearch = () => {
    setActiveSearchQuery(ui.searchQuery)
    setSkip(0)
    updateURL()
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    setActiveSearchQuery("") // 태그 선택 시 검색 초기화
    updateURL()
  }

  const handleUserClick = async (user: any) => {
    try {
      await fetchUser(user.id)
      ui.openUserModal()
    } catch (error) {
      console.error("사용자 정보 로드 오류:", error)
    }
  }

  const handlePostDetail = async (post: any) => {
    setSelectedPost(post)
    ui.openPostDetailDialog()
  }

  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * limit
    setSkip(newSkip)
  }

  return {
    // 데이터
    posts,
    total,
    loading,
    limit,
    skip,
    selectedPost,
    selectedUser,
    tags,
    selectedTag,

    // UI 상태
    ui,

    // 액션
    setLimit,
    setSelectedPost,

    // 이벤트 핸들러
    handlePageChange,
    handleTagClick,
    handlePostDetail,
    handleSearch,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    handleUserClick,

    // 계산된 값
    currentPage: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(total / limit),
  }
}
