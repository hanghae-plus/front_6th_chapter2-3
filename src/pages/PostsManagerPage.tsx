import { useCallback, useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { useSearchParams } from "react-router-dom"
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
  const [searchParams, setSearchParams] = useSearchParams()

  // URL 파라미터 파싱 (단일 출처)
  const { skip, limit, search, sortBy, sortOrder, tag } = useMemo(() => {
    return {
      skip: parseInt(searchParams.get("skip") || "0"),
      limit: parseInt(searchParams.get("limit") || "10"),
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sortBy") || "",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
      tag: searchParams.get("tag") || "",
    }
  }, [searchParams])

  const [searchQuery, setSearchQuery] = useState<string>("")

  // UI 전용 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // TanStack Query로 모든 데이터 조회
  const { data: postsData, isLoading: isLoadingPosts } = useGetPosts(limit, skip, sortBy, sortOrder)
  const { data: searchData, isLoading: isLoadingSearch } = useGetPostSearch(searchQuery, limit, skip, sortBy, sortOrder)
  const { data: tagData, isLoading: isLoadingTag } = useGetPostsByTag(tag, limit, skip, sortBy, sortOrder)
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers("limit=0&select=username,image")

  // 조건에 따라 사용할 데이터 선택
  const currentPostsData = searchQuery ? searchData : tag && tag !== "all" ? tagData : postsData

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

  // URL 업데이트 함수 (URL을 단일 출처로 유지)
  const updateURL = useCallback(
    (
      patch: Partial<{ skip: number; limit: number; search: string; sortBy: string; sortOrder: string; tag: string }>,
    ) => {
      const normalize = (value: unknown) => {
        if (value == null || value === "" || value === "all" || value === "none") return undefined
        return value as string | number
      }

      const nextParams = createURLParams({
        skip: normalize(patch.skip ?? skip),
        limit: normalize(patch.limit ?? limit),
        // 기존 동작 유지: 검색은 입력 시 자동 반영(쿼리), URL은 다른 변경 시에만 포함
        search: normalize(patch.search ?? searchQuery),
        sortBy: normalize(patch.sortBy ?? sortBy),
        sortOrder: normalize(patch.sortOrder ?? sortOrder),
        tag: normalize(patch.tag ?? tag),
      })
      setSearchParams(nextParams)
    },
    [skip, limit, sortBy, sortOrder, tag, searchQuery, setSearchParams],
  )

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

  // URL 변경 시 검색어 동기화 (루프 없음)
  useEffect(() => {
    setSearchQuery(search)
  }, [search])

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
            selectedTag={tag}
            onTagChange={(value) => updateURL({ tag: value, skip: 0 })}
            sortBy={sortBy}
            onSortByChange={(value) => updateURL({ sortBy: value, skip: 0 })}
            sortOrder={sortOrder}
            onSortOrderChange={(value) => updateURL({ sortOrder: value, skip: 0 })}
          />

          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={tag}
              onTagSelect={(tag) => updateURL({ tag, skip: 0 })}
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
            onPrev={() => updateURL({ skip: Math.max(0, skip - limit) })}
            onNext={() => updateURL({ skip: skip + limit })}
            onLimitChange={(value) => updateURL({ limit: value, skip: 0 })}
          />
        </div>
      </CardContent>

      <PostFormDialog open={showAddDialog} onOpenChange={setShowAddDialog} mode="create" />

      <PostFormDialog open={showEditDialog} onOpenChange={setShowEditDialog} mode="edit" initialPost={selectedPost} />

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
