import { usePostsStore } from '../../../../entities/post/model/store';
import { useDialogStore } from '../../../../shared/store/dialog';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';

export const useViewPost = () => {
  const { selectedPost } = usePostsStore();
  const { isDialogOpen, closeDialog } = useDialogStore();

  return {
    selectedPost,
    isDialogOpen: isDialogOpen(DIALOG_KEYS.POST_DETAIL),
    closeDialog: () => closeDialog(DIALOG_KEYS.POST_DETAIL),
  };
};
