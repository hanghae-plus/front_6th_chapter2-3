import { useState } from 'react';

import { useAddPost } from '@/entities/post/model/usePosts';

export const useCreatePost = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 });

  const { mutate: addPost } = useAddPost();

  const openDialog = () => {
    setNewPost({ title: '', body: '', userId: 1 });
    setShowDialog(true);
  };

  const handleSubmit = () => {
    addPost(newPost, {
      onSuccess: () => {
        setShowDialog(false);
      },
    });
  };

  return {
    showDialog,
    setShowDialog,
    newPost,
    setNewPost,
    openDialog,
    handleSubmit,
  };
};
