import { usePostsStore } from '../../entities/post/model/store';
import { useDeletePost } from '../../features/posts/delete-post/model/hooks';
import { usePostsInitialization } from '../../features/posts/initialization/model/hooks';
import { usePagination } from '../../features/posts/pagination/model/hooks';
import { useViewPost } from '../../features/posts/view-post/model/hooks';
import { useViewUser } from '../../features/user/view-user/model/hooks';
import { DIALOG_KEYS } from '../../shared/constant/dialog';
import { useDialogStore } from '../../shared/store/dialog';

export const usePostsManager = () => {
  const { posts, total, loading, setSelectedPost } = usePostsStore();
  const { openUserModal } = useViewUser();
  const { openPostDetail } = useViewPost();
  const { deletePost } = useDeletePost();
  const { skip, limit, setSkip, setLimit } = usePagination();
  const { openDialog } = useDialogStore();

  usePostsInitialization();

  const handleEditPost = (post: any) => {
    setSelectedPost(post);
    openDialog(DIALOG_KEYS.EDIT_POST);
  };

  return {
    posts,
    total,
    loading,
    skip,
    limit,
    setSkip,
    setLimit,
    openUserModal,
    openPostDetail,
    handleEditPost,
    deletePost,
  };
};
