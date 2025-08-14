import { useUIStore } from '@/shared/lib';
import { Button, ContentDialog, Textarea } from '@/shared/ui';

import { useEditCommentForm } from '../hooks/useEditCommentForm';

export const EditCommentFormDialog = () => {
  const { showEditCommentDialog, setShowEditCommentDialog } = useUIStore();
  const { commentBody, handleChangeBody, handleSubmit, resetForm } =
    useEditCommentForm();

  return (
    <ContentDialog
      open={showEditCommentDialog}
      onOpenChange={setShowEditCommentDialog}
      onClose={resetForm}
      title='댓글 수정'
    >
      <form className='space-y-4' onSubmit={handleSubmit}>
        <Textarea
          placeholder='댓글 내용'
          value={commentBody}
          onChange={handleChangeBody}
        />
        <Button type='submit'>댓글 업데이트</Button>
      </form>
    </ContentDialog>
  );
};
