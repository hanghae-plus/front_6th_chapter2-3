import { usePosts } from '@/entities/post/model/usePosts';
import { PostTable } from '@/entities/post/ui/PostTable';
import { CreateCommentDialog } from '@/features/comment-create/ui/CreateCommentDialog';
import { EditCommentDialog } from '@/features/comment-edit/ui/EditCommentDialog';
import { CreatePostButton } from '@/features/post-create/ui/CreatePostButton';
import { CreatePostDialog } from '@/features/post-create/ui/CreatePostDialog';
import { EditPostDialog } from '@/features/post-edit/ui/EditPostDialog';
import { PostFilter } from '@/features/post-filter/ui/PostFilter';
import { Pagination } from '@/features/post-pagination/ui/Pagination';
import { PostSearch } from '@/features/post-search/ui/PostSearch';
import { ViewPostDialog } from '@/features/post-view/ui/ViewPostDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { PostCommentsWidget } from '@/widgets/post-comments/ui/PostCommentsWidget';
import { UserProfileDialog } from '@/widgets/user-profile-dialog/ui/UserProfileDialog';

export const PostManagerWidget = () => {
  const { posts, isLoading } = usePosts();

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <CreatePostButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <div className='flex gap-4'>
            <PostSearch />
            <PostFilter />
          </div>
          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTable posts={posts} />
          )}
          {/* 페이지네이션 */}
          <Pagination />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <CreatePostDialog />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog />

      {/* 댓글 추가 대화상자 */}
      <CreateCommentDialog />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog />

      {/* 게시물 상세 보기 대화상자 */}
      <ViewPostDialog>
        <PostCommentsWidget />
      </ViewPostDialog>

      {/* 사용자 모달 */}
      <UserProfileDialog />
    </Card>
  );
};
