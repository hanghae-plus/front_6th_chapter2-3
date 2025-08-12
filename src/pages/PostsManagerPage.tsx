import { useCallback, useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@shared/ui"
import { createURLParams } from "@shared/lib"
import type { Post } from "@entities/post"
import { useGetPosts, useGetPostSearch, useGetPostsByTag } from "@entities/post"
import { useGetUsers } from "@entities/user"
import type { Comment, NewComment } from "@entities/comment"
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
  
  // URL 파라미터 파싱 (parseURLParams 통합)
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return {
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      search: params.get("search") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      tag: params.get("tag") || "",
    }
  }, [location.search])

  // 상태 관리
  const [skip, setSkip] = useState(urlParams.skip)
  const [limit, setLimit] = useState(urlParams.limit)
  const [searchQuery, setSearchQuery] = useState(urlParams.search)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(urlParams.sortBy)
  const [sortOrder, setSortOrder] = useState(urlParams.sortOrder)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedTag, setSelectedTag] = useState(urlParams.tag)

  // TanStack Query로 모든 데이터 조회
  const { data: postsData, isLoading: isLoadingPosts } = useGetPosts(limit, skip, sortBy, sortOrder)
  const { data: searchData, isLoading: isLoadingSearch } = useGetPostSearch(searchQuery, limit, skip, sortBy, sortOrder)
  const { data: tagData, isLoading: isLoadingTag } = useGetPostsByTag(selectedTag, limit, skip, sortBy, sortOrder)
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers("limit=0&select=username,image")

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

  // URL 업데이트 함수
  const updateURL = useCallback(() => {
    const params = createURLParams({
      skip,
      limit,
      search: searchQuery,
      sortBy: sortBy === "none" ? undefined : sortBy,
      sortOrder,
      tag: selectedTag === "all" ? undefined : selectedTag,
    })
    navigate(`?${params}`)
  }, [skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate])





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
    const params = new URLSearchParams(location.search)
    const parsedParams = {
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      search: params.get("search") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      tag: params.get("tag") || "",
    }
    
    setSkip(parsedParams.skip)
    setLimit(parsedParams.limit)
    setSearchQuery(parsedParams.search)
    setSortBy(parsedParams.sortBy)
    setSortOrder(parsedParams.sortOrder)
    setSelectedTag(parsedParams.tag)
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

      <PostFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        formTitle="새 게시물 추가"
        mode="create"
      />

      <PostFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        formTitle="게시물 수정"
        mode="edit"
        initialPost={selectedPost}
      />

      <CommentFormDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        formTitle="새 댓글 추가"
        mode="create"
        postId={newComment.postId ?? undefined}
        onSuccess={() => setNewComment({ body: "", postId: null, userId: 1 })}
      />

      <CommentFormDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        formTitle="댓글 수정"
        mode="edit"
        initialComment={selectedComment}
      />

      {/* 게시물 상세 보기 다이얼로그 위젯 */}
      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        searchQuery={searchQuery}
        onOpenAddComment={(postId) => {
          setNewComment((prev) => ({ ...prev, postId }))
          setShowAddCommentDialog(true)
        }}
        onEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
      />

      {/* 사용자 다이얼로그 */}
      <UserDialog open={showUserModal} onOpenChange={setShowUserModal} userId={userIdForDialog} />
    </Card>
  )
}

export default PostsManager
