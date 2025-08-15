import { useUIStore } from '@/shared/lib';
import { Button, ContentDialog, Textarea } from '@/shared/ui';

import { useAddCommentForm } from '../hooks/useAddCommentForm';

export const AddCommentDialog = () => {
  const { showAddCommentDialog, setShowAddCommentDialog } = useUIStore();

  const { commentBody, handleChangeBody, handleSubmit, resetForm } =
    useAddCommentForm();

  return (
    <ContentDialog
      open={showAddCommentDialog}
      onOpenChange={setShowAddCommentDialog}
      onClose={resetForm}
      title='새 댓글 추가'
    >
      <form className='space-y-4' onSubmit={handleSubmit}>
        <Textarea
          placeholder='댓글 내용'
          value={commentBody}
          onChange={handleChangeBody}
        />
        <Button type='submit'>댓글 추가</Button>
      </form>
    </ContentDialog>
  );
};
