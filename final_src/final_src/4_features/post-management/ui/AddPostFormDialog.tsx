import { UI_CONSTANTS } from '@/shared/constants';
import { useUIStore } from '@/shared/lib';
import { Button, ContentDialog, Input, Textarea } from '@/shared/ui';

import { useCreatePostForm } from '../hooks/useCreatePostForm';

export const AddPostFormDialog = () => {
  const { setShowAddDialog, showAddDialog } = useUIStore();
  const {
    postTitle,
    postBody,
    postUserId,
    handleSubmit,
    resetForm,
    handleChangeTitle,
    handleChangeBody,
    handleChangeUserId,
  } = useCreatePostForm();

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
