import { useState, useCallback, FormEvent } from "react"
import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
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
} from "../components"
import { usePosts } from "../hooks/usePosts"
import { useTags } from "../hooks/useTags"
import { useComments } from "../hooks/useComments"
import { addPost, updatePost, deletePost } from "../api/posts"
import { fetchUserDetails } from "../api/users"
import type { Post, UserDetails, UserSummary, Comment } from "../types"

const PostsManagerPage = () => {
  // Custom Hooks
  const {
    posts,
    total,
    loading: postsLoading,
    error: postsError,
    skip,
    limit,
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    setSkip,
    setLimit,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
    handleSearch,
    getPosts,
  } = usePosts()

  const { tags } = useTags()
  const { comments, getComments, addComment, updateComment, deleteComment, likeComment } = useComments()

  // Dialogs and Selected Items State
  const [showAddPostDialog, setShowAddPostDialog] = useState(false)
  const [showEditPostDialog, setShowEditPostDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null)

  // Form State
  const [newPostData, setNewPostData] = useState({ title: "", body: "", userId: 1 })
  const [newCommentData, setNewCommentData] = useState({ body: "", postId: 0, userId: 1 })

  // Post Actions
  const handleAddPost = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await addPost(newPostData)
      setShowAddPostDialog(false)
      setNewPostData({ title: "", body: "", userId: 1 })
      getPosts() // Refresh posts
    } catch (error) {
      console.error("Failed to add post:", error)
    }
  }

  const handleUpdatePost = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedPost) return
    try {
      await updatePost(selectedPost.id, { title: selectedPost.title, body: selectedPost.body })
      setShowEditPostDialog(false)
      getPosts() // Refresh posts
    } catch (error) {
      console.error("Failed to update post:", error)
    }
  }

  const handleDeletePost = async (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId)
        getPosts() // Refresh posts
      } catch (error) {
        console.error("Failed to delete post:", error)
      }
    }
  }

  // Comment Actions
  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault()
    if (!newCommentData.postId) return
    try {
      await addComment(newCommentData.postId, newCommentData.body, newCommentData.userId)
      setShowAddCommentDialog(false)
      setNewCommentData({ body: "", postId: 0, userId: 1 })
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
  }

  const handleUpdateComment = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedComment) return
    try {
      await updateComment(selectedComment.postId, selectedComment.id, selectedComment.body)
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("Failed to update comment:", error)
    }
  }

  // UI Event Handlers
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    getComments(post.id)
    setShowPostDetailDialog(true)
  }

  const openUserModal = async (user: UserSummary) => {
    if (!user) return
    try {
      const userData = await fetchUserDetails(user.id)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("Failed to fetch user details:", error)
    }
  }

  const highlightText = useCallback(
    (text: string, highlight: string) => {
      if (!text) return null
      if (!highlight.trim()) {
        return <span>{text}</span>
      }
      const regex = new RegExp(`(${highlight})`, "gi")
      const parts = text.split(regex)
      return (
        <span>
          {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
        </span>
      )
    },
    [],
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddPostDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <Select value={selectedTag} onValueChange={(value) => setSelectedTag(value === "all" ? "" : value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.slug} value={tag.slug}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts Table */}
          {postsLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : postsError ? (
            <div className="text-red-500 text-center p-4">Error: {postsError.message}</div>
          ) : (
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
                                  ? "text-white bg-blue-500 hover:bg-blue-600"
                                  : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                              }`}
                              onClick={() => setSelectedTag(tag)}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.author && (
                        <div
                          className="flex items-center space-x-2 cursor-pointer"
                          onClick={() => openUserModal(post.author!)}
                        >
                          <img src={post.author.image} alt={post.author.username} className="w-8 h-8 rounded-full" />
                          <span>{post.author.username}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.reactions?.likes ?? 0}</span>
                        <ThumbsDown className="w-4 h-4" />
                        <span>{post.reactions?.dislikes ?? 0}</span>
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
                            setShowEditPostDialog(true)
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
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

      {/* Add Post Dialog */}
      <Dialog open={showAddPostDialog} onOpenChange={setShowAddPostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPost} className="space-y-4">
            <Input
              placeholder="제목"
              value={newPostData.title}
              onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })}
              required
            />
            <Textarea
              placeholder="내용"
              value={newPostData.body}
              onChange={(e) => setNewPostData({ ...newPostData, body: e.target.value })}
              required
              rows={10}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={newPostData.userId}
              onChange={(e) => setNewPostData({ ...newPostData, userId: Number(e.target.value) })}
              required
            />
            <Button type="submit">게시물 추가</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      {selectedPost && (
        <Dialog open={showEditPostDialog} onOpenChange={setShowEditPostDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>게시물 수정</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <Input
                placeholder="제목"
                value={selectedPost.title}
                onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                required
              />
              <Textarea
                placeholder="내용"
                value={selectedPost.body}
                onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
                required
                rows={10}
              />
              <Button type="submit">게시물 업데이트</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Post Detail Dialog */}
      {selectedPost && (
        <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{highlightText(selectedPost.title, searchQuery)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="whitespace-pre-wrap">{highlightText(selectedPost.body, searchQuery)}</p>
              {/* Comments Section */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">댓글</h3>
                  <Button
                    size="sm"
                    onClick={() => {
                      setNewCommentData({ body: "", postId: selectedPost.id, userId: 1 });
                      setShowAddCommentDialog(true);
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    댓글 추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {comments[selectedPost.id]?.map((comment) => (
                    <div key={comment.id} className="flex items-start justify-between text-sm border-b pb-2">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <span className="font-medium">{comment.user.username}:</span>
                        <span className="truncate">{comment.body}</span>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => likeComment(selectedPost.id, comment.id)}>
                          <ThumbsUp className="w-3 h-3" />
                          <span className="ml-1 text-xs">{comment.likes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setSelectedComment(comment);
                            setShowEditCommentDialog(true);
                          }}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => deleteComment(selectedPost.id, comment.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Comment Dialog */}
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddComment} className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newCommentData.body}
              onChange={(e) => setNewCommentData({ ...newCommentData, body: e.target.value })}
              required
            />
            <Button type="submit">댓글 추가</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Comment Dialog */}
      {selectedComment && (
        <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>댓글 수정</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateComment} className="space-y-4">
              <Textarea
                placeholder="댓글 내용"
                value={selectedComment.body}
                onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
                required
              />
              <Button type="submit">댓글 업데이트</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* User Modal */}
      {selectedUser && (
        <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>사용자 정보</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img src={selectedUser.image} alt={selectedUser.username} className="w-24 h-24 rounded-full mx-auto" />
              <h3 className="text-xl font-semibold text-center">{selectedUser.username}</h3>
              <div className="space-y-2 text-sm">
                <p><strong>이름:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                <p><strong>나이:</strong> {selectedUser.age}</p>
                <p><strong>이메일:</strong> {selectedUser.email}</p>
                <p><strong>전화번호:</strong> {selectedUser.phone}</p>
                <p><strong>주소:</strong> {selectedUser.address?.address}, {selectedUser.address?.city}</p>
                <p><strong>직장:</strong> {selectedUser.company?.name} - {selectedUser.company?.title}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}

export default PostsManagerPage
