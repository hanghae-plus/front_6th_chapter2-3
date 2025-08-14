import { useCreatePostStore } from './createPostStore';

import { useAddPost } from '@/entities/post/model/usePosts';

export const useCreatePost = () => {
  const { isDialogOpen, newPost, openDialog, closeDialog, setNewPost } = useCreatePostStore();

  const { mutate: addPost } = useAddPost();

  const handleSubmit = () => {
    addPost(newPost, {
      onSuccess: () => closeDialog(),
    });
  };

  return {
    isDialogOpen,
    newPost,
    setNewPost,
    openDialog,
    closeDialog,
    handleSubmit,
  };
};
