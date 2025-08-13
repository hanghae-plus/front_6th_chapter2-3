import { useState } from "react"
import { Plus, Search } from "lucide-react"
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
  Textarea,
} from "../shared/ui"
import { useQueryStates, parseAsString } from "nuqs"
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query"
import { postQueries } from "../entities/post/api/queries"
import { userQueries } from "../entities/user/api/queries"
import { postMutations } from "../entities/post/api/mutations"
import { commentMutations } from "../entities/comment/api/mutations"
import type { CreatePostRequest } from "../entities/post/api/api"
import { Post, Tag } from "../entities/post/model"
import { User } from "../entities/user/model"
import { commentQueries } from "../entities/comment/api/queries"
import { CommentItem } from "../entities/comment/model"
import { CommentList } from "../entities/comment/ui"
import { UserDetail } from "../entities/user/ui"
import { PostsTable } from "../widgets/posts-table/ui"
import { highlightText } from "../shared/lib"

const PostsManager = () => {
  const [queryParams, setQueryParams] = useQueryStates({
    skip: parseAsString.withDefault("0"),
    limit: parseAsString.withDefault("10"),
    search: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault(""),
    order: parseAsString.withDefault("asc"),
    tag: parseAsString.withDefault(""),
  })

  const { skip, limit, search: searchQuery, sortBy, order, tag: selectedTag } = queryParams

  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState<CreatePostRequest>({ title: "", body: "", userId: 1 })
  const [selectedComment, setSelectedComment] = useState<CommentItem | null>(null)
  const [newComment, setNewComment] = useState<{ body: string; postId: number | null; userId: number }>({
    body: "",
    postId: null,
    userId: 1,
  })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const postQuery = useQuery({
    ...postQueries.listQuery({
      limit: +limit,
      skip: +skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order: order === "desc" ? "desc" : "asc",
    }),
    enabled: !searchQuery && (!selectedTag || selectedTag === "all"),
    placeholderData: keepPreviousData,
  })

  const { data: users } = useQuery(userQueries.listQuery())

  const { data: tags } = useQuery(postQueries.tagQuery())

  // TODO: 이걸 나중에 묶는걸 고려해봐도...
  const searchedPostsQuery = useQuery({
    ...postQueries.searchQuery({
      search: searchQuery,
      limit: +limit,
      skip: +skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order: order === "desc" ? "desc" : "asc",
    }),
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  })

  const tagPostsQuery = useQuery({
    ...postQueries.listByTagQuery({
      tag: selectedTag,
      limit: +limit,
      skip: +skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order: order === "desc" ? "desc" : "asc",
    }),
    enabled: !!selectedTag && selectedTag !== "all",
    placeholderData: keepPreviousData,
  })
  const active = searchQuery ? searchedPostsQuery : selectedTag && selectedTag !== "all" ? tagPostsQuery : postQuery

  const isLoading = active.isLoading

  const posts =
    active.data?.posts?.map((post: Post) => ({
      ...post,
      author: users?.users?.find((user: User) => user.id === post.userId),
    })) ?? []
  const total = active.data?.total ?? 0

  const addPostMutation = useMutation(postMutations.addMutation())
  const addPost = () => {
    addPostMutation.mutate(newPost, {
      onSuccess: () => {
        setShowAddDialog(false)
        setNewPost({ title: "", body: "", userId: 1 })
      },
    })
  }

  const updatePostMutation = useMutation(postMutations.updateMutation())
  const updatePost = () => {
    if (!selectedPost) return
    updatePostMutation.mutate(
      { id: selectedPost.id, post: selectedPost },
      {
        onSuccess: () => {
          setShowEditDialog(false)
          setSelectedPost(null)
        },
      },
    )
  }

  const deletePostMutation = useMutation(postMutations.deleteMutation())
  const deletePost = (id: number) => {
    deletePostMutation.mutate(id)
  }

  const { data: comments = [] } = useQuery({
    ...commentQueries.byPostQuery(selectedPost?.id ?? 0),
    select: (res) => res.comments,
  })

  const addCommentMutation = useMutation(commentMutations.addMutation())
  const addComment = () => {
    if (!newComment.postId) return
    addCommentMutation.mutate(
      { body: newComment.body, postId: newComment.postId, userId: newComment.userId },
      {
        onSuccess: () => {
          setShowAddCommentDialog(false)
          setNewComment({ body: "", postId: null, userId: 1 })
        },
      },
    )
  }

  const updateCommentMutation = useMutation(commentMutations.updateMutation())
  const updateComment = () => {
    if (!selectedComment) return
    updateCommentMutation.mutate(
      { id: selectedComment.id, postId: selectedPost?.id ?? 0, body: selectedComment.body },
      {
        onSuccess: () => {
          setShowEditCommentDialog(false)
        },
      },
    )
  }

  const deleteCommentMutation = useMutation(commentMutations.deleteMutation())
  const deleteComment = (id: number) => {
    deleteCommentMutation.mutate({ id, postId: selectedPost?.id ?? 0 })
  }

  const likeCommentMutation = useMutation({
    ...commentMutations.likeMutation(),
  })
  const likeComment = (id: number) => {
    const currentLikes = comments.find((c: CommentItem) => c.id === id)?.likes ?? 0
    likeCommentMutation.mutate({ id, postId: selectedPost?.id ?? 0, likes: currentLikes + 1 })
  }

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  const renderPostTable = () => (
    <PostsTable
      posts={posts}
      selectedTag={selectedTag}
      searchQuery={searchQuery}
      onTagClick={(tag) => setQueryParams({ tag })}
      onOpenUser={(user) => user && openUserModal(user)}
      onOpenDetail={openPostDetail}
      onEdit={(post) => {
        setSelectedPost(post)
        setShowEditDialog(true)
      }}
      onDelete={deletePost}
    />
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
                  onChange={(e) => setQueryParams({ search: e.target.value })}
                  onKeyPress={(e) => e.key === "Enter"}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setQueryParams({ tag: value })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags?.map((tag: Tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setQueryParams({ sortBy: value })}>
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
            <Select value={order} onValueChange={(value) => setQueryParams({ order: value })}>
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
              <Select value={limit} onValueChange={(value) => setQueryParams({ limit: value })}>
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
                disabled={parseInt(skip) === 0}
                onClick={() => setQueryParams({ skip: Math.max(0, parseInt(skip) - parseInt(limit)).toString() })}
              >
                이전
              </Button>
              <Button
                disabled={parseInt(skip) + parseInt(limit) >= total}
                onClick={() => setQueryParams({ skip: (parseInt(skip) + parseInt(limit)).toString() })}
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
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={30}
              placeholder="내용"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={newPost.userId}
              onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            />
            <Button onClick={addPost}>게시물 추가</Button>
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
              onChange={(e) => setSelectedPost((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e) => setSelectedPost((prev) => (prev ? { ...prev, body: e.target.value } : prev))}
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
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
            <Button onClick={addComment}>댓글 추가</Button>
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
              onChange={(e) => setSelectedComment((prev) => (prev ? { ...prev, body: e.target.value } : prev))}
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title ?? "", searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body ?? "", searchQuery)}</p>
            <CommentList
              comments={comments}
              searchQuery={searchQuery}
              onAddComment={() => {
                setNewComment((prev) => ({ ...prev, postId: selectedPost?.id ?? 0 }))
                setShowAddCommentDialog(true)
              }}
              onEditComment={(comment) => {
                setSelectedComment(comment)
                setShowEditCommentDialog(true)
              }}
              onDeleteComment={deleteComment}
              onLikeComment={likeComment}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <UserDetail user={selectedUser} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
