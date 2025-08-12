import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { IPost } from '../../../../entities/post/model/type';
import { updatePostApi } from '../../../../entities/post/api/post-api';

export const useUpdatePost = (
  post: IPost,
  onSuccess?: (updated: IPost) => void
) => {
  const initialPost = {
    title: post.title,
    body: post.body,
  };

  const [editPost, setEditPost] = useState<Partial<IPost>>(initialPost);

  const setTitle = (title: string) =>
    setEditPost((prev) => ({ ...prev, title }));
  const setBody = (body: string) => setEditPost((prev) => ({ ...prev, body }));

  const mutation = useMutation({
    mutationFn: () => updatePostApi(editPost),
    
    onSuccess: (updatedPost) => {
      onSuccess?.(updatedPost);
    },
    onError: (error) => {
      console.error('게시물 업데이트 오류:', error);
    },
  });

  const updatePost = () => mutation.mutate();

  return { editPost, setTitle, setBody, updatePost };
};
