import { useState } from 'react';
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

  const updatePost = async () => {
    try {
      const updatedPost = await updatePostApi(editPost);

      // 게시물 업데이트 성공 후 처리
      // setPosts(posts.map((post) => (post.id === data.id ? data : post)));
      // setShowEditDialog(false);
      onSuccess?.(updatedPost);
    } catch (error) {
      console.error('게시물 업데이트 오류:', error);
    }
  };

  return { editPost, setTitle, setBody, updatePost };
};
