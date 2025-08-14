import { UI_CONSTANTS, useUIStore } from '@/shared/index';
import { Button, ContentDialog, Input, Textarea } from '@/shared/ui';

import { useEditPostForm } from '../hooks/useEditPostForm';

export const EditPostFormDialog = () => {
  const { title, body, handleChangeTitle, handleChangeBody, handleSubmit } =
    useEditPostForm();
  const { showEditDialog, setShowEditDialog } = useUIStore();

  return (
    <ContentDialog
      open={showEditDialog}
      onOpenChange={setShowEditDialog}
      title='게시물 수정'
    >
      <form className='space-y-4' onSubmit={handleSubmit}>
        <Input placeholder='제목' value={title} onChange={handleChangeTitle} />
        <Textarea
          rows={UI_CONSTANTS.TEXTAREA_ROWS.MEDIUM}
          placeholder='내용'
          value={body}
          onChange={handleChangeBody}
        />
        <Button type='submit'>게시물 업데이트</Button>
      </form>
    </ContentDialog>
  );
};
