import { PostDialogs } from '@/widgets/post-dialogs/ui/PostDialogs';
import { PostListManager } from '@/widgets/post-list-manager/ui/PostListManager';

const AdminPage = () => {
  return (
    <div>
      <PostListManager />
      <PostDialogs />
    </div>
  );
};

export default AdminPage;
