import { PostsTable } from '@/widgets/posts';
import {
  AddCommentDialog,
  AddPostButton,
  AddPostDialog,
  EditCommentDialog,
  PostDialog,
  PostsFilter,
  PostsPagination,
} from '@/features/posts';
import { UserModal } from '@/features/users';
import { EditPostDialog } from '@/features/posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';

const PostsManager = () => {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <AddPostButton />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostsFilter />

          {/* 게시물 테이블 */}
          <PostsTable />

          {/* 페이지네이션 */}
          <PostsPagination />
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
      <PostDialog />

      {/* 사용자 모달 */}
      <UserModal />
    </Card>
  );
};

export default PostsManager;
