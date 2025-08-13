import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQueryParameter } from '../../../../shared/hook/useQueryParameter';
import { IAddPost, IPosts } from '../../../../entities/post/model/type';
import { addPostApi } from '../../../../entities/post/api/post-api';
import { postModel } from '../../../../entities/post/model/store';

const initialPost: IAddPost = {
  title: '',
  body: '',
  userId: 1,
};

export const useAddPost = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { params } = useQueryParameter();

  const [newPost, setNewPost] = useState<IAddPost>(initialPost);

  const mutation = useMutation({
    mutationFn: (post: IAddPost) => addPostApi(post),

    onSuccess: (createdPost) => {
      const newPost = postModel.addResponseToPost(createdPost);

      queryClient.setQueryData<IPosts>(['posts', params], (prev) => {
        if (!prev) {
          return {
            posts: [newPost],
            limit: 10,
            skip: 0,
            total: 1,
          };
        }

        return postModel.addPost(prev, newPost);
      });

      onSuccess?.();
      setNewPost(initialPost);
    },
    onError: (error) => {
      console.error('게시물 추가 오류:', error);
    },
  });

  const setTitle = (title: string) =>
    setNewPost((prev) => ({ ...prev, title }));
  const setBody = (body: string) => setNewPost((prev) => ({ ...prev, body }));
  const setUserId = (userId: number) =>
    setNewPost((prev) => ({ ...prev, userId }));

  const addPost = () => {
    mutation.mutate(newPost);
  };

  return { newPost, setTitle, setBody, setUserId, addPost };
};
