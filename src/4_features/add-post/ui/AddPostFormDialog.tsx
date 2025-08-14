import { useState } from 'react';

import { useCreatePostMutation } from '@/entities/post';
import { API_CONSTANTS, UI_CONSTANTS } from '@/shared/constants';
import { useDialogStore } from '@/shared/lib';
import { Button, ContentDialog, Input, Textarea } from '@/shared/ui';

export const AddPostFormDialog = () => {
  const { showAddDialog, setShowAddDialog } = useDialogStore();
  const { mutate: createPost } = useCreatePostMutation({
    onSuccess: () => {
      resetForm();
      setShowAddDialog(false);
    },
    onError: error => {
      console.error('게시물 추가 오류:', error);
    },
  });

  const [postTitle, setPostTitle] = useState<string>('');
  const [postBody, setPostBody] = useState<string>('');
  const [postUserId, setPostUserId] = useState<number>(
    API_CONSTANTS.DEFAULT_USER_ID
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createPost({
      title: postTitle,
      body: postBody,
      userId: postUserId,
    });
  };

  const resetForm = () => {
    setPostTitle('');
    setPostBody('');
    setPostUserId(API_CONSTANTS.DEFAULT_USER_ID);
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostTitle(e.target.value);
  };

  const handleChangeBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostBody(e.target.value);
  };

  const handleChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostUserId(Number(e.target.value));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      setShowAddDialog(open);
      return;
    }

    setShowAddDialog(open);
  };

  return (
    <ContentDialog
      title='새 게시물 추가'
      open={showAddDialog}
      onOpenChange={handleOpenChange}
    >
      <form className='space-y-4' onSubmit={handleSubmit}>
        <Input
          placeholder='제목'
          value={postTitle}
          onChange={handleChangeTitle}
        />

        <Textarea
          rows={UI_CONSTANTS.TEXTAREA_ROWS.LARGE}
          placeholder='내용'
          value={postBody}
          onChange={handleChangeBody}
        />

        <Input
          type='number'
          placeholder='사용자 ID'
          value={postUserId}
          onChange={handleChangeUserId}
        />
        <Button type='submit'>게시물 추가</Button>
      </form>
    </ContentDialog>
  );
};
