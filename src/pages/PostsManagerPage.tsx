import { useState } from 'react'
import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { IPost, ITag } from '@entities/post'
import { IUserDetail } from '@entities/user'
import {
  deleteComment,
  fetchComments,
  IComment,
  ICommentRequest,
  addComment,
  updateComment,
  likeComment,
} from '@entities/comment'
import { addPost, deletePost, updatePost, INewPost } from '@entities/post'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/Table'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/Card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/Dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { Textarea } from '@shared/ui/Textarea'
import { IUser } from '@shared/model'
import { http } from '@shared/lib/http-client'

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const queryClient = useQueryClient()

  // 상태 관리
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'))
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'))
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '')
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || '')
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '')
  const [sortOrder, setSortOrder] = useState(queryParams.get('sortOrder') || 'asc')

  // UI 상태 관리
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState<INewPost>({ title: '', body: '', userId: 1 })
  const [selectedComment, setSelectedComment] = useState<IComment | null>(null)
  const [newComment, setNewComment] = useState<{ body: string; postId: number | null; userId: number }>({
    body: '',
    postId: null,
    userId: 1,
  })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUserDetail | null>(null)

  // 태그 목록 쿼리
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async (): Promise<ITag[]> => {
      return await http.get<ITag[]>('/posts/tags')
    },
  })

  // 게시물 목록 쿼리 (통합)
  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', { limit, skip, searchQuery, selectedTag }],
    queryFn: async (): Promise<{ posts: IPost[]; total: number }> => {
      let url: string

      // 검색 쿼리가 있는 경우
      if (searchQuery) {
        url = `/posts/search?q=${searchQuery}`
      }
      // 태그가 선택된 경우 (전체 제외)
      else if (selectedTag && selectedTag !== 'all') {
        url = `/posts/tag/${selectedTag}`
      }
      // 기본 목록
      else {
        url = `/posts?limit=${limit}&skip=${skip}`
      }

      const [rawPosts, users] = await Promise.all([
        http.get<{ posts: Omit<IPost, 'author'>[]; total: number }>(url),
        http.get<{ users: Pick<IUser, 'id' | 'username' | 'image'>[] }>('/users?limit=0&select=username,image'),
      ])

      const withAuthors: IPost[] = rawPosts.posts.map((post) => ({
        ...post,
        author: users.users.find((u) => u.id === post.userId),
      }))

      return { posts: withAuthors, total: rawPosts.total }
    },
  })

  // 댓글 목록 쿼리
  const useCommentsQuery = (postId: number) => {
    return useQuery({
      queryKey: ['comments', postId],
      queryFn: async (): Promise<IComment[]> => {
        const { comments } = await fetchComments(postId)
        return comments
      },
      enabled: !!postId,
    })
  }

  // 게시물 추가 뮤테이션
  const addPostMutation = useMutation({
    mutationFn: async (newPost: INewPost) => {
      return await addPost(newPost)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setShowAddDialog(false)
      setNewPost({ title: '', body: '', userId: 1 })
    },
  })

  // 게시물 수정 뮤테이션
  const updatePostMutation = useMutation({
    mutationFn: async (post: IPost) => {
      return await updatePost(post)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setShowEditDialog(false)
    },
  })

  // 게시물 삭제 뮤테이션
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      await deletePost({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  // 댓글 추가 뮤테이션
  const addCommentMutation = useMutation({
    mutationFn: async (comment: ICommentRequest) => {
      return await addComment(comment)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.postId] })
      setShowAddCommentDialog(false)
      setNewComment({ body: '', postId: null, userId: 1 })
    },
  })

  // 댓글 수정 뮤테이션
  const updateCommentMutation = useMutation({
    mutationFn: async (comment: IComment) => {
      return await updateComment(comment)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.postId] })
      setShowEditCommentDialog(false)
    },
  })

  // 댓글 삭제 뮤테이션
  const deleteCommentMutation = useMutation({
    mutationFn: async ({ id, postId }: { id: number; postId: number }) => {
      await deleteComment(id)
      return postId
    },
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })

  // 댓글 좋아요 뮤테이션
  const likeCommentMutation = useMutation({
    mutationFn: async ({ id, likes, postId }: { id: number; likes: number; postId: number }) => {
      await likeComment(id, likes)
      return postId
    },
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })

  // 현재 게시물 목록과 총 개수
  const posts = postsData?.posts || []
  const total = postsData?.total || 0

  // URL 업데이트 함수
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

  // 게시물 검색
  const searchPosts = () => {
    updateURL()
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = (tag: string) => {
    setSelectedTag(tag === 'all' ? '' : tag)
    updateURL()
  }

  // 게시물 상세 보기
  const openPostDetail = (post: IPost) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기 (Hook 규칙 위반 해결)
  const openUserModal = async (user: Pick<IUser, 'id'>) => {
    try {
      const userData = await http.get<IUserDetail>(`/users/${user.id}`)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  // 하이라이트 함수
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, 'gi')
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  // 댓글 렌더링 컴포넌트
  const CommentsSection = ({ postId }: { postId: number }) => {
    const { data: comments = [], isLoading: isCommentsLoading } = useCommentsQuery(postId)

    if (isCommentsLoading) {
      return <div>댓글 로딩 중...</div>
    }

    return (
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
            <Plus className="w-3 h-3 mr-1" />
            댓글 추가
          </Button>
        </div>
        <div className="space-y-1">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="font-medium truncate">{comment.user.username}:</span>
                <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    likeCommentMutation.mutate({
                      id: comment.id,
                      likes: comment.likes,
                      postId,
                    })
                  }
                >
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCommentMutation.mutate({ id: comment.id, postId })}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 게시물 테이블 렌더링
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
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(post.author!)}>
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
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
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
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

  return (
    <Card className="w-full max-w-6xl mx-auto">
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
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && searchPosts()}
                />
              </div>
            </div>
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
          {isLoading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

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
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={newPost.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={10}
              placeholder="내용"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={newPost.userId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPost({ ...newPost, userId: Number(e.target.value) })
              }
            />
            <Button onClick={() => addPostMutation.mutate(newPost)} disabled={addPostMutation.isPending}>
              {addPostMutation.isPending ? '추가 중...' : '게시물 추가'}
            </Button>
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
              value={selectedPost?.title || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                selectedPost && setSelectedPost({ ...selectedPost, title: e.target.value })
              }
            />
            <Textarea
              rows={10}
              placeholder="내용"
              value={selectedPost?.body || ''}
              onChange={(e) => selectedPost && setSelectedPost({ ...selectedPost, body: e.target.value })}
            />
            <Button
              onClick={() => selectedPost && updatePostMutation.mutate(selectedPost)}
              disabled={updatePostMutation.isPending}
            >
              {updatePostMutation.isPending ? '수정 중...' : '게시물 업데이트'}
            </Button>
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
            <Button
              onClick={() =>
                newComment.postId &&
                addCommentMutation.mutate({
                  body: newComment.body,
                  postId: newComment.postId,
                  userId: newComment.userId,
                })
              }
              disabled={addCommentMutation.isPending}
            >
              {addCommentMutation.isPending ? '추가 중...' : '댓글 추가'}
            </Button>
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
              value={selectedComment?.body || ''}
              onChange={(e) => selectedComment && setSelectedComment({ ...selectedComment, body: e.target.value })}
            />
            <Button
              onClick={() => selectedComment && updateCommentMutation.mutate(selectedComment)}
              disabled={updateCommentMutation.isPending}
            >
              {updateCommentMutation.isPending ? '수정 중...' : '댓글 업데이트'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title || '', searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body || '', searchQuery)}</p>
            {selectedPost && <CommentsSection postId={selectedPost.id} />}
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
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{' '}
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
