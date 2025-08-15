import React from 'react';

import { PostForm } from '../../../entities/post';
import { usePostCrud, usePostDialogs, usePostForm } from '../model';
import { usePostList } from '../../post-list';
import { userApi } from '../../../entities/user';

interface PostFormManagerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
}

const PostFormManager: React.FC<PostFormManagerProps> = ({
  isOpen,
  onOpenChange,
  mode,
}) => {
  const { addPost, updatePost } = usePostCrud();
  const { selectedPost, setSelectedPost } = usePostDialogs();
  const { newPost, setNewPost, resetNewPost } = usePostForm();
  const { addPostToList, updatePostInList } = usePostList();

  const handleSubmit = async () => {
    try {
      if (mode === 'add') {
        const newPostResult = await addPost(newPost);
        
        // 새 게시물에 author 정보 추가
        try {
          const usersResponse = await userApi.getUsersList();
          const author = usersResponse.users.find((user: any) => user.id === newPostResult.userId);
          const postWithAuthor = { ...newPostResult, author };
          addPostToList(postWithAuthor);
        } catch (error) {
          // 오류 시 author 없이라도 추가
          addPostToList({ ...newPostResult, author: null });
        }
        
        resetNewPost();
        onOpenChange(false);
      } else if (mode === 'edit' && selectedPost) {
        const updatedPost = await updatePost(selectedPost.id, {
          title: selectedPost.title,
          body: selectedPost.body,
        });
        updatePostInList(updatedPost);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('폼 제출 오류:', error);
    }
  };

  const handleTitleChange = (value: string) => {
    if (mode === 'add') {
      setNewPost({ ...newPost, title: value });
    } else if (mode === 'edit' && selectedPost) {
      setSelectedPost({ ...selectedPost, title: value });
    }
  };

  const handleBodyChange = (value: string) => {
    if (mode === 'add') {
      setNewPost({ ...newPost, body: value });
    } else if (mode === 'edit' && selectedPost) {
      setSelectedPost({ ...selectedPost, body: value });
    }
  };

  const handleUserIdChange = (value: string) => {
    if (mode === 'add') {
      setNewPost({ ...newPost, userId: Number(value) });
    }
  };

  const currentTitle = mode === 'add' ? newPost.title : selectedPost?.title || '';
  const currentBody = mode === 'add' ? newPost.body : selectedPost?.body || '';
  const currentUserId = mode === 'add' ? newPost.userId : undefined;

  return (
    <PostForm
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      mode={mode}
      title={currentTitle}
      body={currentBody}
      userId={currentUserId}
      onTitleChange={handleTitleChange}
      onBodyChange={handleBodyChange}
      onUserIdChange={mode === 'add' ? handleUserIdChange : undefined}
      onSubmit={handleSubmit}
    />
  );
};

export default PostFormManager;