import { useCallback, useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@shared/ui"
import { createURLParams, parseURLParams } from "@shared/lib"
import type { Post, NewPost } from "@entities/post"
import { useGetPosts, useGetPostSearch, useGetPostsByTag, usePostPost, usePutPost, useDeletePost } from "@entities/post"
import { useGetUsers, useGetUser } from "@entities/user"
import type { Comment, NewComment } from "@entities/comment"
import { useGetComments } from "@entities/comment"
import { usePostComment, usePutComment, useDeleteComment, usePatchCommentLikes } from "@entities/comment"
import {
  PostTable,
  PostFilters,
  PostDetailDialog,
  Pagination,
  UserDialog,
  PostFormDialog,
  CommentFormDialog,
} from "@widgets"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const urlParams = parseURLParams(location.search)

  // 상태 관리
  const [skip, setSkip] = useState(urlParams.skip)
  const [limit, setLimit] = useState(urlParams.limit)
  const [searchQuery, setSearchQuery] = useState(urlParams.search)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(urlParams.sortBy)
  const [sortOrder, setSortOrder] = useState(urlParams.sortOrder)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })
  const [selectedTag, setSelectedTag] = useState(urlParams.tag)

  // TanStack Query로 모든 데이터 조회
  const { data: postsData, isLoading: isLoadingPosts } = useGetPosts(limit, skip, sortBy, sortOrder)
  const { data: searchData, isLoading: isLoadingSearch } = useGetPostSearch(searchQuery, limit, skip, sortBy, sortOrder)
  const { data: tagData, isLoading: isLoadingTag } = useGetPostsByTag(selectedTag, limit, skip, sortBy, sortOrder)
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers("limit=0&select=username,image")

  // TanStack Query mutations
  const createPost = usePostPost()
  const editPost = usePutPost()
  const removePost = useDeletePost()

  // 조건에 따라 사용할 데이터 선택
  const currentPostsData = searchQuery ? searchData : selectedTag && selectedTag !== "all" ? tagData : postsData

  // 게시물에 작성자 정보 병합
  const posts = useMemo(() => {
    const base = currentPostsData?.posts || []
    return base.map((post) => ({
      ...post,
      author: usersData?.users?.find((user) => user.id === post.userId),
    }))
  }, [currentPostsData?.posts, usersData?.users])
  const total = currentPostsData?.total || 0
  const isLoading = isLoadingPosts || isLoadingSearch || isLoadingTag || isLoadingUsers
  // React Query로 전환됨: 로컬 comments 상태 제거
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<NewComment>({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userIdForDialog, setUserIdForDialog] = useState<number | null>(null)
  const { data: userDetail } = useGetUser(userIdForDialog ?? 0)

  // URL 업데이트 함수
  const updateURL = useCallback(() => {
    const params = createURLParams({
      skip,
      limit,
      search: searchQuery,
      sortBy,
      sortOrder,
      tag: selectedTag,
    })
    navigate(`?${params}`)
  }, [skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate])

  // 게시물 추가
  const addPost = () => {
    createPost.mutate(newPost, {
      onSuccess: () => {
        setShowAddDialog(false)
        setNewPost({ title: "", body: "", userId: 1 })
      },
      onError: (error) => {
        console.error("게시물 추가 오류:", error)
      },
    })
  }

  // 게시물 업데이트
  const updatePost = () => {
    if (!selectedPost) return

    editPost.mutate(
      { id: selectedPost.id, post: selectedPost },
      {
        onSuccess: () => {
          setShowEditDialog(false)
        },
        onError: (error) => {
          console.error("게시물 업데이트 오류:", error)
        },
      },
    )
  }

  // 게시물 삭제
  const deletePost = (id: number) => {
    removePost.mutate(id, {
      onError: (error) => {
        console.error("게시물 삭제 오류:", error)
      },
    })
  }

  // 댓글 React Query 훅들
  const postIdForComments = selectedPost?.id ?? null
  const { data: commentsData } = useGetComments(postIdForComments)
  const addCommentMutation = usePostComment()
  const updateCommentMutation = usePutComment()
  const deleteCommentMutation = useDeleteComment()
  const likeCommentMutation = usePatchCommentLikes()

  // 댓글 추가
  const addComment = async () => {
    if (!newComment.postId) return
    addCommentMutation.mutate(newComment, {
      onSuccess: () => {
        setShowAddCommentDialog(false)
        setNewComment({ body: "", postId: null, userId: 1 })
      },
      onError: (error) => {
        console.error("댓글 추가 오류:", error)
      },
    })
  }

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment) return
    updateCommentMutation.mutate(
      { id: selectedComment.id, body: selectedComment.body, postId: selectedComment.postId },
      {
        onSuccess: () => setShowEditCommentDialog(false),
        onError: (error) => console.error("댓글 업데이트 오류:", error),
      },
    )
  }

  // 댓글 삭제
  const deleteComment = async (id: number) => {
    deleteCommentMutation.mutate(
      { id, postId: postIdForComments ?? 0 },
      {
        onError: (error) => console.error("댓글 삭제 오류:", error),
      },
    )
  }

  // 댓글 좋아요
  const likeComment = async (id: number) => {
    const currentLikes = commentsData?.comments?.find((c: Comment) => c.id === id)?.likes || 0
    likeCommentMutation.mutate(
      { id, currentLikes, postId: postIdForComments ?? 0 },
      {
        onError: (error) => console.error("댓글 좋아요 오류:", error),
      },
    )
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기 (React Query 사용)
  const openUserModal = (userId: number) => {
    setUserIdForDialog(userId)
    setShowUserModal(true)
  }

  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag, updateURL])

  useEffect(() => {
    const params = parseURLParams(location.search)
    setSkip(params.skip)
    setLimit(params.limit)
    setSearchQuery(params.search)
    setSortBy(params.sortBy)
    setSortOrder(params.sortOrder)
    setSelectedTag(params.tag)
  }, [location.search])

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
          <PostFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={() => {}} // 검색은 자동으로 실행됨
            selectedTag={selectedTag}
            onTagChange={(value) => {
              setSelectedTag(value)
              updateURL()
            }}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onTagSelect={(tag) => {
                setSelectedTag(tag)
                updateURL()
              }}
              onOpenDetail={openPostDetail}
              onOpenUser={openUserModal}
              onEdit={(post) => {
                setSelectedPost(post)
                setShowEditDialog(true)
              }}
              onDelete={deletePost}
            />
          )}

          <Pagination
            total={total}
            skip={skip}
            limit={limit}
            onPrev={() => setSkip(Math.max(0, skip - limit))}
            onNext={() => setSkip(skip + limit)}
            onLimitChange={(value) => setLimit(value)}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 다이얼로그 위젯 */}
      <PostFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        formTitle="새 게시물 추가"
        titleValue={newPost.title}
        bodyValue={newPost.body}
        onTitleChange={(v) => setNewPost({ ...newPost, title: v })}
        onBodyChange={(v) => setNewPost({ ...newPost, body: v })}
        showUserId
        userIdValue={newPost.userId}
        onUserIdChange={(val) => setNewPost({ ...newPost, userId: val })}
        submitLabel="게시물 추가"
        onSubmit={addPost}
      />

      {/* 게시물 수정 다이얼로그 위젯 */}
      <PostFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        formTitle="게시물 수정"
        titleValue={selectedPost?.title || ""}
        bodyValue={selectedPost?.body || ""}
        onTitleChange={(v) => selectedPost && setSelectedPost({ ...selectedPost, title: v })}
        onBodyChange={(v) => selectedPost && setSelectedPost({ ...selectedPost, body: v })}
        submitLabel="게시물 업데이트"
        onSubmit={updatePost}
      />

      {/* 댓글 추가 다이얼로그 위젯 */}
      <CommentFormDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        formTitle="새 댓글 추가"
        bodyValue={newComment.body}
        onBodyChange={(v) => setNewComment({ ...newComment, body: v })}
        submitLabel="댓글 추가"
        onSubmit={addComment}
      />

      {/* 댓글 수정 다이얼로그 위젯 */}
      <CommentFormDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        formTitle="댓글 수정"
        bodyValue={selectedComment?.body || ""}
        onBodyChange={(v) => selectedComment && setSelectedComment({ ...selectedComment, body: v })}
        submitLabel="댓글 업데이트"
        onSubmit={updateComment}
      />

      {/* 게시물 상세 보기 다이얼로그 위젯 */}
      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={commentsData?.comments || []}
        searchQuery={searchQuery}
        onOpenAddComment={(postId) => {
          setNewComment((prev) => ({ ...prev, postId }))
          setShowAddCommentDialog(true)
        }}
        onLikeComment={likeComment}
        onEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onDeleteComment={deleteComment}
      />

      {/* 사용자 다이얼로그 */}
      <UserDialog open={showUserModal} onOpenChange={setShowUserModal} user={userDetail ?? null} />
    </Card>
  )
}

export default PostsManager
