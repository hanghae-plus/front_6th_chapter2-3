import { useAtom } from "jotai"
import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useEffect } from "react"
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
import { URL_PATH } from "../shared/config/routes"
import {
  useCreateComment,
  useCreatePost,
  useDeleteComment,
  useDeletePost,
  useLikeComment,
  usePosts,
  usePostsByTag,
  useSearchPosts,
  useTags,
  useUpdateComment,
  useUpdatePost,
} from "../shared/hooks"
import { commentsAtom, loadingAtom, postsAtom, tagsAtom, totalAtom, usePostsManagerStore } from "../shared/stores"
import { Comment } from "../types/comment.type"
import { Post } from "../types/product.type"
import { User } from "../types/user.type"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // jotai atoms
  const [posts] = useAtom(postsAtom)
  const [comments, setComments] = useAtom(commentsAtom)
  const [tags] = useAtom(tagsAtom)
  const [loading] = useAtom(loadingAtom)
  const [total] = useAtom(totalAtom)

  // zustand store
  const {
    selectedPost,
    selectedComment,
    selectedUser,
    postDraft,
    commentDraft,
    showPostDetailDialog,
    showAddCommentDialog,
    showEditCommentDialog,
    showAddDialog,
    showEditDialog,
    showUserModal,
    searchInfo,
    setSelectedPost,
    setSelectedComment,
    setSelectedUser,
    setPostDraft,
    setCommentDraft,
    setShowPostDetailDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowAddDialog,
    setShowEditDialog,
    setShowUserModal,
    setSearchInfo,
  } = usePostsManagerStore()

  // TanStack Query hooks
  const postsQuery = usePosts(searchInfo.limit, searchInfo.skip)
  const searchQuery = useSearchPosts(searchInfo.searchQuery)
  const postsByTagQuery = usePostsByTag(searchInfo.selectedTag)
  const tagsQuery = useTags()
  const createPostMutation = useCreatePost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()
  const createCommentMutation = useCreateComment()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const likeCommentMutation = useLikeComment()

  // URL에서 초기 검색 정보 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchInfo({
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      searchQuery: params.get("search") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      selectedTag: params.get("tag") || "",
    })
  }, [location.search, setSearchInfo])
  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchInfo.skip) params.set("skip", searchInfo.skip.toString())
    if (searchInfo.limit) params.set("limit", searchInfo.limit.toString())
    if (searchInfo.searchQuery) params.set("search", searchInfo.searchQuery)
    if (searchInfo.sortBy) params.set("sortBy", searchInfo.sortBy)
    if (searchInfo.sortOrder) params.set("sortOrder", searchInfo.sortOrder)
    if (searchInfo.selectedTag) params.set("tag", searchInfo.selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 게시물 관련 함수들 (TanStack Query 사용)
  const handleFetchPosts = () => {
    postsQuery.refetch()
  }

  const handleSearchPosts = () => {
    if (!searchInfo.searchQuery) {
      handleFetchPosts()
      return
    }
    searchQuery.refetch()
  }

  const handleFetchPostsByTag = (tag: string) => {
    if (!tag || tag === "all") {
      handleFetchPosts()
      return
    }
    postsByTagQuery.refetch()
  }

  const handleAddPost = async () => {
    try {
      await createPostMutation.mutateAsync(postDraft)
      setShowAddDialog(false)
      setPostDraft({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const handleUpdatePost = async () => {
    if (!selectedPost) return
    try {
      await updatePostMutation.mutateAsync({ id: selectedPost.id, data: selectedPost })
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  const handleDeletePost = async (id: number) => {
    try {
      await deletePostMutation.mutateAsync(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(URL_PATH.COMMENTS.BY_POST(postId))
      const data = await response.json()
      setComments((prev: Record<number, Comment[]>) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 관련 함수들 (TanStack Query 사용)
  const handleAddComment = async () => {
    try {
      await createCommentMutation.mutateAsync(commentDraft)
      setShowAddCommentDialog(false)
      setCommentDraft({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const handleUpdateComment = async () => {
    if (!selectedComment) return
    try {
      await updateCommentMutation.mutateAsync({ id: selectedComment.id, data: { body: selectedComment.body } })
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ id, postId })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const handleLikeComment = async (id: number, postId: number) => {
    try {
      const currentLikes = comments[postId]?.find((c) => c.id === id)?.likes || 0
      await likeCommentMutation.mutateAsync({ id, likes: currentLikes + 1 })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
    try {
      const response = await fetch(URL_PATH.USERS.DETAIL(user.id))
      console.log(response)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    tagsQuery.refetch()
  }, [])

  useEffect(() => {
    if (searchInfo.selectedTag) {
      handleFetchPostsByTag(searchInfo.selectedTag)
    } else {
      handleFetchPosts()
    }
    updateURL()
  }, [searchInfo.skip, searchInfo.limit, searchInfo.sortBy, searchInfo.sortOrder, searchInfo.selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchInfo({
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      searchQuery: params.get("search") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      selectedTag: params.get("tag") || "",
    })
  }, [location.search])

  // 하이라이트 함수 추가
  const highlightText = (text: string, highlight: string) => {
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
                <div>{highlightText(post.title, searchInfo.searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        searchInfo.selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSearchInfo({ selectedTag: tag })
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
                onClick={() => post.author && openUserModal(post.author)}
              >
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
                <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setCommentDraft({ postId })
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchInfo.searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment as Comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id, postId)}>
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
                  value={searchInfo.searchQuery}
                  onChange={(e) => setSearchInfo({ searchQuery: e.target.value })}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchPosts()}
                />
              </div>
            </div>
            <Select
              value={searchInfo.selectedTag}
              onValueChange={(value) => {
                setSearchInfo({ selectedTag: value })
                handleFetchPostsByTag(value)
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
            <Select value={searchInfo.sortBy} onValueChange={(value) => setSearchInfo({ sortBy: value })}>
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
            <Select value={searchInfo.sortOrder} onValueChange={(value) => setSearchInfo({ sortOrder: value })}>
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
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select
                value={searchInfo.limit.toString()}
                onValueChange={(value) => setSearchInfo({ limit: Number(value) })}
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
              <Button
                disabled={searchInfo.skip === 0}
                onClick={() => setSearchInfo({ skip: Math.max(0, searchInfo.skip - searchInfo.limit) })}
              >
                이전
              </Button>
              <Button
                disabled={searchInfo.skip + searchInfo.limit >= total}
                onClick={() => setSearchInfo({ skip: searchInfo.skip + searchInfo.limit })}
              >
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
              value={postDraft.title}
              onChange={(e) => setPostDraft({ title: e.target.value })}
            />
            <Textarea
              rows={30}
              placeholder="내용"
              value={postDraft.body}
              onChange={(e) => setPostDraft({ body: e.target.value })}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={postDraft.userId}
              onChange={(e) => setPostDraft({ userId: Number(e.target.value) })}
            />
            <Button onClick={handleAddPost}>게시물 추가</Button>
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
              value={selectedPost?.title || ""}
              onChange={(e) => setSelectedPost(selectedPost ? { ...selectedPost, title: e.target.value } : null)}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e) => setSelectedPost(selectedPost ? { ...selectedPost, body: e.target.value } : null)}
            />
            <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
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
              value={commentDraft.body}
              onChange={(e) => setCommentDraft({ body: e.target.value })}
            />
            <Button onClick={handleAddComment}>댓글 추가</Button>
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
              value={selectedComment?.body || ""}
              onChange={(e) =>
                setSelectedComment(selectedComment ? { ...selectedComment, body: e.target.value } : null)
              }
            />
            <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title || "", searchInfo.searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body || "", searchInfo.searchQuery)}</p>
            {renderComments(selectedPost?.id || 0)}
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
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
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
