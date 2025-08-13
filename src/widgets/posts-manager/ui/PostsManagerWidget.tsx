import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useState } from "react"

import { useComments } from "@/features/comment-management/hooks/useComments"
import { usePostActions } from "@/features/post-management/hooks/usePostActions"
import { usePostList } from "@/features/post-management/hooks/usePostList"
import { usePostTags } from "@/features/post-management/hooks/usePostTags"
import { useUserModal } from "@/features/user-management/hooks/useUserModal"
import { Button } from "@/shared/ui/Button"
import { Card } from "@/shared/ui/Card"
import { Dialog } from "@/shared/ui/Dialog"
import { Input } from "@/shared/ui/Input"
import { Select } from "@/shared/ui/Select"
import { Table } from "@/shared/ui/Table"
import { Textarea } from "@/shared/ui/Textarea"

export function PostsManagerWidget() {
  const {
    posts,
    setPosts,
    total,
    skip,
    setSkip,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    loading,
    updateURL,
    searchPosts,
    fetchPostsByTag,
  } = usePostList()

  const {
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    selectedPost,
    setSelectedPost,
    newPost,
    setNewPost,
    addPost,
    updatePost,
    deletePost,
  } = usePostActions()

  const { tags } = usePostTags()

  const {
    comments,
    selectedComment,
    setSelectedComment,
    newComment,
    setNewComment,
    showAddCommentDialog,
    setShowAddCommentDialog,
    showEditCommentDialog,
    setShowEditCommentDialog,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  } = useComments()

  const { showUserModal, setShowUserModal, selectedUser, openUserModal } = useUserModal()

  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)

  const openPostDetail = (post: any) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

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

  const renderPostTable = () => (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[50px]">ID</Table.Head>
          <Table.Head>제목</Table.Head>
          <Table.Head className="w-[150px]">작성자</Table.Head>
          <Table.Head className="w-[150px]">반응</Table.Head>
          <Table.Head className="w-[150px]">작업</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {posts.map((post) => (
          <Table.Row key={post.id}>
            <Table.Cell>{post.id}</Table.Cell>
            <Table.Cell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className={`cursor-pointer rounded-[4px] px-1 text-[9px] font-semibold ${
                        selectedTag === tag
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
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
            </Table.Cell>
            <Table.Cell>
              <div className="flex cursor-pointer items-center space-x-2" onClick={() => openUserModal(post.author)}>
                <img src={post.author?.image} alt={post.author?.username} className="h-8 w-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="h-4 w-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deletePost(post.id, posts, setPosts)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )

  const renderComments = (postId: number) => (
    <div className="mt-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }))
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="mr-1 h-3 w-3" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between border-b pb-1 text-sm">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="truncate font-medium">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="h-3 w-3" />
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
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Card className="mx-auto w-full max-w-6xl">
      <Card.Header>
        <Card.Title className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            게시물 추가
          </Button>
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchPosts()}
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
              <Select.Trigger className="w-[180px]">
                <Select.Value placeholder="태그 선택" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="all">모든 태그</Select.Item>
                {tags.map((tag) => (
                  <Select.Item key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <Select.Trigger className="w-[180px]">
                <Select.Value placeholder="정렬 기준" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="none">없음</Select.Item>
                <Select.Item value="id">ID</Select.Item>
                <Select.Item value="title">제목</Select.Item>
                <Select.Item value="reactions">반응</Select.Item>
              </Select.Content>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <Select.Trigger className="w-[180px]">
                <Select.Value placeholder="정렬 순서" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="asc">오름차순</Select.Item>
                <Select.Item value="desc">내림차순</Select.Item>
              </Select.Content>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                <Select.Trigger className="w-[180px]">
                  <Select.Value placeholder="10" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="10">10</Select.Item>
                  <Select.Item value="20">20</Select.Item>
                  <Select.Item value="30">30</Select.Item>
                </Select.Content>
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
      </Card.Content>

      {/* 게시물 추가 대화상자 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>새 게시물 추가</Dialog.Title>
          </Dialog.Header>
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
            <Button onClick={() => addPost(posts, setPosts)}>게시물 추가</Button>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>게시물 수정</Dialog.Title>
          </Dialog.Header>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ""}
              onChange={(e) => setSelectedPost({ ...selectedPost!, title: e.target.value })}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e) => setSelectedPost({ ...selectedPost!, body: e.target.value })}
            />
            <Button onClick={() => updatePost(posts, setPosts)}>게시물 업데이트</Button>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>새 댓글 추가</Dialog.Title>
          </Dialog.Header>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />
            <Button onClick={addComment}>댓글 추가</Button>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>댓글 수정</Dialog.Title>
          </Dialog.Header>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e) => setSelectedComment({ ...selectedComment!, body: e.target.value })}
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <Dialog.Content className="max-w-3xl">
          <Dialog.Header>
            <Dialog.Title>{highlightText(selectedPost?.title || "", searchQuery)}</Dialog.Title>
          </Dialog.Header>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
            {selectedPost && renderComments(selectedPost.id)}
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>사용자 정보</Dialog.Title>
          </Dialog.Header>
          <div className="space-y-4">
            <img src={selectedUser?.image} alt={selectedUser?.username} className="mx-auto h-24 w-24 rounded-full" />
            <h3 className="text-center text-xl font-semibold">{selectedUser?.username}</h3>
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
        </Dialog.Content>
      </Dialog>
    </Card>
  )
}
