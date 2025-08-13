import { useLocation } from "react-router-dom"
import { Card } from "../shared/ui"
import { CommentAddDialog } from "../feature"
import { CommentEditDialog } from "../feature/comment/ui/CommentEditDialog"
import { Comments } from "../feature/comment/ui/Comments"
import { PostAddDialog } from "../feature/post/ui/PostAddDialog"
import { PostEditDialog } from "../feature/post/ui/PostEditDialog"
import { PostDetailDialog } from "../feature/post/ui/PostDetailDialog"
import { PostUserDialog } from "../feature/post/ui/PostUserDialog"
import { PostHeader } from "../feature/post/ui/PostHeader"
import { PostList } from "../feature/post"

const PostsManager = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostHeader />
      <PostList queryParams={queryParams} />
      {/* 게시물 추가 대화상자 */}
      <PostAddDialog />

      {/* 게시물 수정 대화상자 */}
      <PostEditDialog />

      {/* 댓글 추가 대화상자 */}
      <CommentAddDialog />

      {/* 댓글 수정 대화상자 */}
      <CommentEditDialog />

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog />

      {/* 게시물 수정 대화상자 */}
      <PostEditDialog />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog>
        <Comments />
      </PostDetailDialog>

      {/* 사용자 모달 */}
      <PostUserDialog />
    </Card>
  )
}

export default PostsManager
