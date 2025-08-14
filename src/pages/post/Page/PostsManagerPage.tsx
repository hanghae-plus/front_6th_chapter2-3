import { useEffect } from "react"
import { useSetAtom, useAtom } from "jotai"
import { Card, CardContent, CardHeader, CardTitle, PostDetailDialogWrapper } from "../../../shared/ui"
import AddPostButton from "../../../features/add-post-button/ui/AddPostButton"
import { usePosts } from "../../../features/post/model/usePosts"
import { usePostFilters } from "../../../features/post/model/usePostFilters"
import { usePostDialogs } from "../../../features/post/model/usePostDialogs"
import { AddPostDialog, EditPostDialog } from "../../../widgets"
import { PostsListFilter } from "../../../widgets/post-list-table/ui/PostsListFilter"
import { UserDialog } from "../../../widgets/user-dialog/UserDialog"
import { EditCommentDialog } from "../../../widgets/comment-dialog/ui/EditCommentDialog"
import { AddCommentDialog } from "../../../widgets/comment-dialog/ui/AddCommentDialog"
import { PostsListPagination } from "../../../widgets/post-list-table/ui/PostsListPagination"
import { PostsListTable } from "../../../widgets/post-list-table/ui/PostsListTable"
import { deletePostAtom } from "../../../features/post/model/useRemovePost"
import { commentsAtom, searchQueryAtom } from "../../../store/postsAtoms"
import { externalSortOrderAtom, setSortOrderAtom } from "../../../features/filter/model/useSortOrder"

const PostsManager = () => {
  const setDeletePost = useSetAtom(deletePostAtom)
  const setExternalSortOrder = useSetAtom(externalSortOrderAtom)
  const setSortOrderExternal = useSetAtom(setSortOrderAtom)

  // 커스텀 훅들 사용
  const { loading, deletePost } = usePosts()

  const { sortOrder, setSortOrder } = usePostFilters()

  const { openAddDialog } = usePostDialogs()

  // 댓글 관련 상태를 atoms에 연결
  const [, setCommentsAtom] = useAtom(commentsAtom)
  const [, setSearchQueryAtom] = useAtom(searchQueryAtom)

  useEffect(() => {
    setDeletePost(() => deletePost)
  }, [setDeletePost, deletePost])

  useEffect(() => {
    setExternalSortOrder(sortOrder)
  }, [setExternalSortOrder, sortOrder])

  useEffect(() => {
    setSortOrderExternal(setSortOrder)
  }, [setSortOrderExternal, setSortOrder])

  // 댓글 상태를 atoms에 동기화
  useEffect(() => {
    setCommentsAtom([])
  }, [setCommentsAtom])

  // 검색 쿼리를 atoms에 동기화 (필요한 경우)
  useEffect(() => {
    setSearchQueryAtom("")
  }, [setSearchQueryAtom])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <AddPostButton onClick={openAddDialog} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostsListFilter />

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : <PostsListTable />}

          {/* 페이지네이션 */}
          <PostsListPagination />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialogWrapper />

      {/* 사용자 모달 */}
      <UserDialog />
    </Card>
  )
}

export default PostsManager
