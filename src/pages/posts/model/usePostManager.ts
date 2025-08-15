import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFetchPosts, useSearchPosts, useFetchTags } from '@/features/post'
import { Post } from '@/entities/post/model/types'
import {
  CommentsByPost,
  selectedCommentType,
  NewComment,
} from '@/entities/comment/model/types'
import {
  useLikeComment,
  useDeleteComment,
  useAddComment,
  useUpdateComment,
  useFetchComment,
} from '@/features/comment'
import { SelectedUser } from '@/entities/user/model/types'
import { useOpenUser } from '@/features/user'

export const usePostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'))
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'))
  const [searchQuery, setSearchQuery] = useState(
    queryParams.get('search') || ''
  )
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '')
  const [sortOrder, setSortOrder] = useState(
    queryParams.get('sortOrder') || 'asc'
  )
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 })
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || '')
  const [comments, setComments] = useState<CommentsByPost>({})
  const [selectedComment, setSelectedComment] =
    useState<selectedCommentType | null>(null)
  const [newComment, setNewComment] = useState<NewComment>({
    body: '',
    postId: null,
    userId: 1,
  })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null) // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set('skip', skip.toString())
    if (limit) params.set('limit', limit.toString())
    if (searchQuery) params.set('search', searchQuery)
    if (sortBy) params.set('sortBy', sortBy)
    if (sortOrder) params.set('sortOrder', sortOrder)
    if (selectedTag) params.set('tag', selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 게시물 가져오기
  const fetchPosts = useFetchPosts(limit, skip, setPosts, setTotal, setLoading)

  // 태그 가져오기
  const fetchTags = useFetchTags(setTags)

  // 게시물 검색
  const searchPosts = useSearchPosts(
    searchQuery,
    setPosts,
    setTotal,
    setLoading,
    fetchPosts,
    selectedTag // tag가 undefined거나 'all'이면 전체, 아니면 태그별
  )

  // 댓글 가져오기
  const fetchComments = useFetchComment(setComments, comments)

  // 댓글 추가
  const addComment = useAddComment(
    newComment,
    setNewComment,
    setComments,
    setShowAddCommentDialog
  )

  // 댓글 업데이트
  const updateComment = useUpdateComment(setComments, setShowEditCommentDialog)

  // 댓글 삭제
  const deleteComment = useDeleteComment(setComments)

  // 댓글 좋아요
  const likeComment = useLikeComment(comments, setComments)

  // 사용자 모달 열기
  const openUserModal = useOpenUser(setSelectedUser, setShowUserModal)

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }
  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    fetchPosts(selectedTag)
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get('skip') || '0'))
    setLimit(parseInt(params.get('limit') || '10'))
    setSearchQuery(params.get('search') || '')
    setSortBy(params.get('sortBy') || '')
    setSortOrder(params.get('sortOrder') || 'asc')
    setSelectedTag(params.get('tag') || '')
  }, [location.search])

  return {
    posts,
    total,
    skip,
    limit,
    searchQuery,
    selectedPost,
    sortBy,
    sortOrder,
    showAddDialog,
    showEditDialog,
    newPost,
    loading,
    tags,
    selectedTag,
    comments,
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    showPostDetailDialog,
    showUserModal,
    selectedUser,

    setPosts,
    setSkip,
    setLimit,
    setSearchQuery,
    setSelectedPost,
    setSortBy,
    setSortOrder,
    setShowAddDialog,
    setShowEditDialog,
    setNewPost,
    setLoading,
    setTags,
    setSelectedTag,
    setComments,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowPostDetailDialog,
    setShowUserModal,

    updateURL,

    fetchPosts,
    fetchTags,
    searchPosts,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    openUserModal,
    openPostDetail,
  }
}
