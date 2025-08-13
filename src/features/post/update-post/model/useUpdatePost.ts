import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IPost, IPosts } from '../../../../entities/post/model/type';
import { updatePostApi } from '../../../../entities/post/api/post-api';
import { postModel } from '../../../../entities/post/model/store';

export const useUpdatePost = (post: IPost, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const initialPost = {
    title: post.title,
    body: post.body,
  };

  const [editPost, setEditPost] = useState<Partial<IPost>>(initialPost);

  const mutation = useMutation({
    mutationFn: (post: Partial<IPost>) => updatePostApi(post),

    onSuccess: (updatedPost) => {
      const editedPost = postModel.editResponseToPost(updatedPost);

      queryClient.setQueryData<IPosts>(['posts'], (prev) => {
        if (!prev) return prev;
        return postModel.updatePost(prev, editedPost);
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error('게시물 업데이트 오류:', error);
    },
  });

  const setTitle = (title: string) =>
    setEditPost((prev) => ({ ...prev, title }));
  const setBody = (body: string) => setEditPost((prev) => ({ ...prev, body }));

  const updatePost = () => {
    mutation.mutate(editPost);
  };

  return { editPost, setTitle, setBody, updatePost };
};
