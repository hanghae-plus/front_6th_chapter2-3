import { useEditPostStore } from './editPostStore';

import { useUpdatePost } from '@/entities/post/model/usePosts';

export const useEditPost = () => {
  const { isDialogOpen, postToEdit, setPostToEdit, openDialog, closeDialog } = useEditPostStore();

  const { mutate: updatePost } = useUpdatePost();

  const handleSubmit = () => {
    if (postToEdit)
      updatePost(postToEdit, {
        onSuccess: () => closeDialog(),
      });
  };

  return {
    isDialogOpen,
    postToEdit,
    setPostToEdit,
    openDialog,
    closeDialog,
    handleSubmit,
  };
};
