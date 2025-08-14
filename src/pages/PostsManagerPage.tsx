import { useEffect, useState, useCallback } from 'react'
import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
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
} from '../components'
import { usePostsStore } from '../shared/stores/postsStore'
import {
  usePostsQuery,
  useTagsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '../entities/post/hooks'
import type { Post, Comment, User } from '../shared/api/posts'

const PostsManagerPage = () => {
  /* ----------------------- zustand 상태 & 액션 ----------------------- */
  const {
    skip,
    limit,
    selectedTag,
    searchQuery,
    comments,
    /* setters */
    setPagination,
    setSelectedTag,
    setSearchQuery,
    /* actions */
    fetchComments,
    addComment: addCommentStore,
    updateComment: updateCommentStore,
    deleteComment: deleteCommentStore,
    likeComment: likeCommentStore,
  } = usePostsStore()

  // React Query data
  const { data: tagsData } = useTagsQuery()
  const tags = tagsData ?? []

  const postsResult = usePostsQuery({ skip, limit, tag: selectedTag, search: searchQuery })
  const posts: Post[] = postsResult.data?.posts ?? []
  const total = postsResult.data?.total ?? 0
  const loading = postsResult.isLoading

  // Mutations
  const addPostMutation = useAddPostMutation()
  const updatePostMutation = useUpdatePostMutation()
  const deletePostMutation = useDeletePostMutation()

  const navigate = useNavigate()
  const location = useLocation()

  /* ----------------------- 로컬 UI 상태 ----------------------- */
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newPost, setNewPost] = useState<Omit<Post, 'id'>>({ title: '', body: '', userId: 1 })

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<{ body: string; postId: number | null; userId: number }>({ body: '', postId: null, userId: 1 })

  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  /* ----------------------- URL 쿼리 동기화 ----------------------- */
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (skip) params.set('skip', skip.toString())
    if (limit) params.set('limit', limit.toString())
    if (searchQuery) params.set('search', searchQuery)
    if (selectedTag) params.set('tag', selectedTag)
    navigate({ search: `?${params.toString()}` })
  }, [skip, limit, searchQuery, selectedTag, navigate])

  // location.search 가 변하면 store 값 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const _skip = parseInt(params.get('skip') || '0')
    const _limit = parseInt(params.get('limit') || '10')
    const _search = params.get('search') || ''
    const _tag = params.get('tag') || ''
    setPagination(_skip, _limit)
    setSearchQuery(_search)
    setSelectedTag(_tag)
  }, [location.search, setPagination, setSearchQuery, setSelectedTag])

  // add effect to sync URL when dependencies change
  useEffect(() => {
    updateURL()
  }, [skip, limit, selectedTag, searchQuery, updateURL])

  /* ----------------------- 최초 로드 ----------------------- */
  useEffect(() => {
    // fetchTags() // Removed as per edit hint
  }, []) // Removed fetchTags from dependencies

  useEffect(() => {
    if (selectedTag) {
      // fetchPostsByTag(selectedTag) // Removed as per edit hint
    } else {
      // fetchPosts() // Removed as per edit hint
    }
  }, [skip, limit, selectedTag]) // Removed fetchPosts, fetchPostsByTag from dependencies

  /* ----------------------- 헬퍼 ----------------------- */
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) return <span>{text}</span>
    const regex = new RegExp(`(${highlight})`, 'gi')
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  /* ----------------------- CRUD 래퍼 ----------------------- */
  const handleAddPost = async () => {
    const created = await addPostMutation.mutateAsync(newPost)
    if (created) {
      setShowAddDialog(false)
      setNewPost({ title: '', body: '', userId: 1 })
    }
  }

  const handleUpdatePost = async () => {
    await updatePostMutation.mutateAsync(selectedPost!)
    setShowEditDialog(false)
  }

  /* ----------------------- 렌더 ----------------------- */
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
        {posts.map((post: Post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? 'text-white bg-blue-500 hover:bg-blue-600'
                          : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
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
            <TableCell>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={async () => {
                  if (!post.author?.id) return
                  const resp = await fetch(`/api/users/${post.author.id}`)
                  const data = await resp.json()
                  setSelectedUser(data)
                  setShowUserModal(true)
                }}
              >
                <img src={post.author?.image ?? ''} alt={post.author?.username ?? ''} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedPost(post)
                  fetchComments(post.id)
                  setShowPostDetailDialog(true)
                }}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
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
                <Button variant="ghost" size="sm" onClick={() => deletePostMutation.mutate(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderComments = (postId: number) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }))
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" /> 댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-start justify-between text-sm border-b pb-1 break-words">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate break-words">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeCommentStore(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" /> <span className="ml-1 text-xs">{comment.likes}</span>
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
              <Button variant="ghost" size="sm" onClick={() => deleteCommentStore(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" /> 게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      updateURL()
                    }
                  }}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
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
          </div>

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setPagination(skip, Number(value))
                  updateURL()
                }}
              >
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
              <Button disabled={skip === 0} onClick={() => setPagination(Math.max(0, skip - limit), limit)}>
                이전
              </Button>
              <Button disabled={skip + limit >= total} onClick={() => setPagination(skip + limit, limit)}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 게시물 추가 Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={typeof newPost.title === 'string' ? newPost.title : ''}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={typeof newPost.body === 'string' ? newPost.body : ''}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Button onClick={handleAddPost}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ''}
              onChange={(e) => setSelectedPost({ ...selectedPost!, title: e.target.value })}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ''}
              onChange={(e) => setSelectedPost({ ...selectedPost!, body: e.target.value })}
            />
            <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 Dialog */}
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
            <Button
              onClick={async () => {
                await addCommentStore(newComment)
                setShowAddCommentDialog(false)
                setNewComment({ body: '', postId: null, userId: 1 })
              }}
            >
              댓글 추가
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 Dialog */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ''}
              onChange={(e) => setSelectedComment({ ...selectedComment!, body: e.target.value })}
            />
            <Button
              onClick={async () => {
                await updateCommentStore(selectedComment!)
                setShowEditCommentDialog(false)
              }}
            >
              댓글 업데이트
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 Dialog */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title ?? '', searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 break-words">
            <p>{highlightText(selectedPost?.body ?? '', searchQuery)}</p>
            {selectedPost && renderComments(selectedPost.id)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 정보 Dialog */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2 text-sm">
              <img src={selectedUser.image} alt={selectedUser.username} className="w-24 h-24 rounded-full mx-auto" />
              <p className="font-semibold text-center text-lg">{selectedUser.username}</p>
              <p>
                <strong>이름:</strong> {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>전화:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser.address?.address}, {selectedUser.address?.city}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManagerPage
