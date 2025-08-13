import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { usePostStore } from "../../entities/post/model/store"
import { useCommentStore } from "../../entities/comment/model/store"
import { useTagStore } from "../../entities/tag/model/store"
import { useUserStore } from "../../entities/user/model/store"
import { usePostsUI } from "./ui"

// 게시물 관리 통합 비즈니스 로직
export const usePostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 스토어
  const { posts, total, loading, skip, limit, fetchPosts, setSkip, setLimit, selectedPost, createPost, editPost, deletePost, setSelectedPost, searchPosts, fetchPostsByTag } = usePostStore()
  const { comments, fetchComments, createComment, editComment, deleteComment, likeComment } = useCommentStore()
  const { tags, selectedTag, fetchTags, setSelectedTag } = useTagStore()
  const { fetchUser, selectedUser } = useUserStore()

  // UI 상태
  const ui = usePostsUI()

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
    ui.setSearchQuery(params.get("search") || "")
    ui.setSortBy(params.get("sortBy") || "")
    ui.setSortOrder(params.get("sortOrder") || "asc")
  }, [location.search])

  // 초기화
  useEffect(() => {
    fetchTags()
  }, [])

  // 데이터 로딩
  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts(skip, limit)
    }
    updateURL()
  }, [skip, limit, ui.sortBy, ui.sortOrder, selectedTag])

  // 비즈니스 로직
  const handleAddPost = async () => {
    try {
      await createPost(ui.newPost)
      ui.closeAddPostDialog()
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const handleUpdatePost = async () => {
    if (!selectedPost) return
    try {
      await editPost(selectedPost.id, {
        title: selectedPost.title,
        body: selectedPost.body,
      })
      ui.closeEditPostDialog()
    } catch (error) {
      console.error("게시물 수정 오류:", error)
    }
  }

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  const handleAddComment = async () => {
    try {
      await createComment(ui.newComment)
      ui.closeAddCommentDialog()
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const handleUpdateComment = async () => {
    if (!ui.selectedComment) return
    try {
      await editComment(ui.selectedComment.id, {
        body: ui.selectedComment.body,
      })
      ui.closeEditCommentDialog()
    } catch (error) {
      console.error("댓글 수정 오류:", error)
    }
  }

  const handleDeleteComment = async (commentId: number, postId: number) => {
    try {
      await deleteComment(commentId, postId)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const handleLikeComment = async (commentId: number) => {
    try {
      await likeComment(commentId, selectedPost?.id || 0)
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  const handleSearch = () => {
    setSkip(0)
    searchPosts(ui.searchQuery)
    updateURL()
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
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
    try {
      await fetchComments(post.id)
    } catch (error) {
      console.error("댓글 로드 오류:", error)
    }
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
    comments,
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
