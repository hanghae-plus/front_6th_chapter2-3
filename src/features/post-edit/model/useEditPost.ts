import { useState } from 'react';

import { Post } from '@/entities/post/model/types';
import { useUpdatePost } from '@/entities/post/model/usePosts';

export const useEditPost = (postToEdit: Post) => {
  const [showDialog, setShowDialog] = useState(false);

  const { mutate: updatePost } = useUpdatePost();

  const handleSubmit = () => {
    updatePost(postToEdit, {
      onSuccess: () => {
        setShowDialog(false);
      },
    });
  };

  return {
    showDialog,
    setShowDialog,
    handleSubmit,
  };
};
