import {
  CommentAddDialog,
  CommentEditDialog,
  Comments,
  PostAddDialog,
  PostDetailDialog,
  PostEditDialog,
  PostHeader,
  PostList,
  PostUserDialog,
} from "../features"
import { Card } from "../shared"

export const PostsManager = () => {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostHeader />
      <PostList />
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
