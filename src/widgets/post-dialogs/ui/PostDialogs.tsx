import {
  CreateCommentDialog,
  EditCommentDialog,
  CreatePostDialog,
  EditPostDialog,
  ViewPostDialog,
} from '@/features';
import { PostCommentsWidget, UserProfileDialog } from '@/widgets';

export const PostDialogs = () => {
  return (
    <>
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
    </>
  );
};
