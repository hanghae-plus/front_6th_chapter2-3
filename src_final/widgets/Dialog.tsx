import {
  PostAddDialog,
  PostDetailDialog,
  PostEditDialog,
} from '@/features/posts';
import AddComment from '@/features/comments/ui/AddComment.tsx';
import EditComment from '@/features/comments/ui/EditComment.tsx';
import UserInfoDialog from '@/features/users/ui/UserInfoDialog.tsx';

const Dialog = () => {
  return (
    <>
      <PostAddDialog />
      <PostEditDialog />
      <AddComment />
      <EditComment />
      <PostDetailDialog />
      <UserInfoDialog />
    </>
  );
};

export default Dialog;
