import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePosts, useSearchPosts, usePostsByTag } from '../../../entities/post/model/queries'
import { useCommentsByPost } from '../../../entities/comment/model/queries'
import { useTags } from '../../../entities/tag/model/queries'
import { useUsers } from '../../../entities/user/model/queries'
import { useAddPost, useUpdatePost, useDeletePost, useAddComment, useUpdateComment, useDeleteComment, useLikeComment } from './mutations'
import { Post } from '../../../entities/post/model/types'
import { Comment } from '../../../entities/comment/model/types'

// PostsManager 피처의 비즈니스 로직 훅
export const usePostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })
  const [newComment, setNewComment] = useState({ body: "", postId: 0, userId: 1 })
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // TanStack Query hooks
  const addPostMutation = useAddPost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()
  const addCommentMutation = useAddComment()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const likeCommentMutation = useLikeComment()

  // 엔티티 쿼리 hooks
  const { data: postsData, isLoading: postsLoading } = usePosts(limit, skip)
  const { data: searchData, isLoading: searchLoading } = useSearchPosts(searchQuery)
  const { data: tagData, isLoading: tagLoading } = usePostsByTag(selectedTag)
  const { data: commentsData, isLoading: commentsLoading } = useCommentsByPost(selectedPost?.id || 0)
  const { data: tags } = useTags()
  const { data: usersData } = useUsers(0, 'id,username,image,firstName,lastName,age,email,phone,address,company')

  // 데이터 결정 로직
  let posts = postsData?.posts || []
  let total = postsData?.total || 0
  let loading = postsLoading

  if (searchQuery.trim()) {
    posts = searchData?.posts || []
    total = searchData?.total || 0
    loading = searchLoading
  } else if (selectedTag && selectedTag !== 'all') {
    posts = tagData?.posts || []
    total = tagData?.total || 0
    loading = tagLoading
  }

  // 사용자 정보와 결합
  const postsWithUsers = useMemo(() => {
    return posts.map((post: Post) => ({
      ...post,
      author: usersData?.users?.find((user: any) => user.id === post.userId),
    }))
  }, [posts, usersData])

  const comments = commentsData?.comments || []

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

  // 비즈니스 로직 함수들
  const handleAddPost = async () => {
    try {
      await addPostMutation.mutateAsync(newPost)
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const handleUpdatePost = async () => {
    if (!selectedPost) return
    try {
      await updatePostMutation.mutateAsync({
        id: selectedPost.id,
        updateData: { title: selectedPost.title, body: selectedPost.body },
      })
      setShowEditDialog(false)
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
      const commentData = { ...newComment, postId: selectedPost.id }
      await addCommentMutation.mutateAsync(commentData)
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: 0, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const handleUpdateComment = async () => {
    if (!selectedComment) return
    try {
      await updateCommentMutation.mutateAsync({
        id: selectedComment.id,
        updateData: { body: selectedComment.body },
      })
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 수정 오류:", error)
    }
  }

  const handleDeleteComment = async (id: number) => {
    try {
      await deleteCommentMutation.mutateAsync(id)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const handleLikeComment = async (id: number, currentLikes: number) => {
    try {
      await likeCommentMutation.mutateAsync({ id, likes: currentLikes })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  const handleSearch = () => {
    setSkip(0)
    updateURL()
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    setSkip(0)
    updateURL()
  }

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  const openUserModal = async (user: any) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  // URL 상태 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // URL 업데이트
  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  return {
    // 상태
    posts: postsWithUsers,
    total,
    loading,
    comments,
    commentsLoading,
    tags,
    selectedPost,
    selectedComment,
    newPost,
    newComment,
    showAddDialog,
    showEditDialog,
    showAddCommentDialog,
    showEditCommentDialog,
    showPostDetailDialog,
    showUserModal,
    selectedUser,
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,
    skip,
    limit,

    // 상태 변경 함수들
    setSelectedPost,
    setSelectedComment,
    setNewPost,
    setNewComment,
    setShowAddDialog,
    setShowEditDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowPostDetailDialog,
    setShowUserModal,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,
    setSkip,
    setLimit,

    // 비즈니스 로직 함수들
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    handleSearch,
    handleTagClick,
    openPostDetail,
    openUserModal,
  }
}
