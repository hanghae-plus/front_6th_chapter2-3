import { useEffect, useState } from "react"
import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
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
} from "../shared/ui"
import { HighlightText } from "../shared/ui/HighlightText"
import { PostsTable } from "../widgets/posts-table/ui/PostsTable"
import { useFetchPostsByMode } from "../features/posts/fetch-posts-by-mode/hooks/useFetchPostsByMode.ts"
import { useSearchMode } from "../features/posts/fetch-posts-by-mode/hooks/useSearchMode.ts"
import { useTagMode } from "../features/posts/fetch-posts-by-mode/hooks/useTagMode.ts.ts"
import { useTagsQuery } from "../entities/post/hook.ts"
import { usePageNavigateMode } from "../features/posts/fetch-posts-by-mode/hooks/usePageNavigateMode.ts"
import { useSortMode } from "../features/posts/fetch-posts-by-mode/hooks/useSortMode.ts"
import { useAddPost } from "../features/posts/hooks/useAddPost.ts"
import { useUpdatePost } from "../features/posts/hooks/useUpdatePost.ts"
import { useDetailPost } from "../features/posts/hooks/useDetailPost.ts"
import { useDeletePost } from "../features/posts/hooks/useDeletePost.ts"
import { useAddComment } from "../features/comment/hooks/useAddComment.ts"
import { useUpdateComment } from "../features/comment/hooks/useUpdateComment.ts"
import { useDeleteComment } from "../features/comment/hooks/useDeleteComment.ts"
import { useLikeComment } from "../features/comment/hooks/useLikeComment.ts"
import { useOpenUser } from "../features/user/hooks/useOpenUser.ts"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")

  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    // if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    // if (searchQuery) params.set("search", searchQuery)
    // if (sortBy) params.set("sortBy", sortBy)
    // if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  const { posts, total, isLoading: loading } = useFetchPostsByMode()
  const searchMode = useSearchMode()
  const tagMode = useTagMode()
  const { data: tags } = useTagsQuery()
  const pageNavigateMode = usePageNavigateMode()
  const sortMode = useSortMode()

  const addPost = useAddPost()
  const updatePost = useUpdatePost()
  const detailPost = useDetailPost()
  const deletePost = useDeletePost()

  const addComment = useAddComment()
  const updateComment = useUpdateComment()
  const deleteComment = useDeleteComment()
  const likeComment = useLikeComment()

  const openUser = useOpenUser()

  // 사용자 모달 열기
  // const openUserModal = async (user) => {
  //   try {
  //     const response = await fetch(`/api/users/${user.id}`)
  //     const userData = await response.json()
  //     setSelectedUser(userData)
  //     setShowUserModal(true)
  //   } catch (error) {
  //     console.error("사용자 정보 가져오기 오류:", error)
  //   }
  // }

  // URL 파라미터 가져오기
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    // setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    // setSortBy(params.get("sortBy") || "")
    // setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // 댓글 렌더링
  const renderComments = (postId) => {
    console.log("댓글 렌더링", postId)
    // console.log(comments)
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2 ">
          <h3 className="text-sm font-semibold">댓글</h3>
          <Button size="sm" onClick={() => addComment.action.open(postId)}>
            <Plus className="w-3 h-3 mr-1" />
            댓글 추가
          </Button>
        </div>
        <div className="space-y-1">
          {detailPost.state.comments?.map((comment) => (
            <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="font-medium truncate">{comment.user.username}:</span>
                {/* <span className="truncate">{highlightText(comment.body, searchQuery)}</span> */}
                <span className="truncate">
                  <HighlightText text={comment.body} highlight={searchQuery} />
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeComment.action.like({ id: comment.id, postId: postId })}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    updateComment.action.open(comment)
                  }}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteComment.action.delete({ id: comment.id, postId })}
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

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => addPost.modal.open()}>
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
                  value={searchMode.value}
                  onChange={(e) => searchMode.change(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchMode.update(searchMode.value)}
                />
              </div>
            </div>
            <Select
              value={tagMode.param}
              onValueChange={(value) => {
                tagMode.update(value)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags?.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sortMode.param.sortBy}
              onValueChange={(value) => sortMode.update(value, sortMode.param.order)}
            >
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
            <Select
              value={sortMode.param.order}
              onValueChange={(value) => sortMode.update(sortMode.param.sortBy, value)}
            >
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
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              data={{
                rows: posts,
                searchQuery,
                selectedTag,
              }}
              handlers={{
                onTagClick: (tag) => {
                  setSelectedTag(tag)
                  // fetchPostsByTag(tag)
                  updateURL()
                },
                onOpenDetail: (post) => detailPost.actions.detail(post),
                onEdit: (post) => updatePost.action.edit(post),
                onDelete: (id) => deletePost.action.delete(id),
                onAuthorClick: (author) => author && openUser.action.open(author.id),
              }}
            />
          )}

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
              <Button disabled={pageNavigateMode.state.prevDisabled} onClick={() => pageNavigateMode.action.prevPage()}>
                이전
              </Button>
              <Button disabled={pageNavigateMode.state.nextDisabled} onClick={() => pageNavigateMode.action.nextPage()}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <Dialog
        open={addPost.modal.isOpen}
        onOpenChange={(open) => (open ? addPost.modal.open() : addPost.modal.close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={addPost.state.newPost.title}
              onChange={(e) => addPost.actions.change("title", e.target.value)}
            />
            <Textarea
              rows={30}
              placeholder="내용"
              value={addPost.state.newPost.body}
              onChange={(e) => addPost.actions.change("body", e.target.value)}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={addPost.state.newPost.userId}
              onChange={(e) => addPost.actions.change("userId", Number(e.target.value))}
            />
            <Button onClick={() => addPost.actions.add(addPost.state.newPost)}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog
        open={updatePost.modal.isOpen}
        onOpenChange={(open) => (open ? updatePost.modal.open() : updatePost.modal.close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={updatePost.state.selectedPost?.title || ""}
              onChange={(e) => updatePost.action.change("title", e.target.value)}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={updatePost.state.selectedPost?.body || ""}
              onChange={(e) => updatePost.action.change("body", e.target.value)}
            />
            <Button onClick={() => updatePost.action.update(updatePost.state.selectedPost!)}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog
        open={addComment.modal.isOpen}
        onOpenChange={(open) => (open ? addComment.modal.open() : addComment.modal.close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={addComment.state.newComment.body}
              onChange={(e) => addComment.action.change(e.target.value)}
            />
            <Button onClick={() => addComment.action.add(addComment.state.newComment)}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog
        open={updateComment.modal.isOpen}
        onOpenChange={(open) => (open ? updateComment.modal.open() : updateComment.modal.close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={updateComment.state.selectedComment?.body || ""}
              onChange={(e) => updateComment.action.change(e.target.value)}
            />
            <Button onClick={() => updateComment.action.update(updateComment.state.selectedComment!)}>
              댓글 업데이트
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog
        open={detailPost.modal.isOpen}
        onOpenChange={(open) => (open ? detailPost.modal.open() : detailPost.modal.close())}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              <HighlightText text={detailPost.state.selectedPost?.title || ""} highlight={searchQuery} />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <HighlightText text={detailPost.state.selectedPost?.body || ""} highlight={searchQuery} />
            </p>
            {renderComments(detailPost.state.selectedPost?.id || 0)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog
        open={openUser.modal.isOpen}
        onOpenChange={(open) => (open ? openUser.modal.open() : openUser.modal.close())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={openUser.state.selectedUser?.image}
              alt={openUser.state.selectedUser?.username}
              className="w-24 h-24 rounded-full mx-auto"
            />
            <h3 className="text-xl font-semibold text-center">{openUser.state.selectedUser?.username}</h3>
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> {openUser.state.selectedUser?.firstName} {openUser.state.selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {openUser.state.selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {openUser.state.selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {openUser.state.selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {openUser.state.selectedUser?.address?.address},{" "}
                {openUser.state.selectedUser?.address?.city}, {openUser.state.selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {openUser.state.selectedUser?.company?.name} -{" "}
                {openUser.state.selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
