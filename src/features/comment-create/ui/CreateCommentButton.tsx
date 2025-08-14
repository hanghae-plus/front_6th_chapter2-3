import { Plus } from 'lucide-react';

import { useCommentDialogStore } from '@/entities/comment/model/commentDialogStore';
import { Button } from '@/shared/ui';

export const CreateCommentButton = () => {
  const { openAddDialog } = useCommentDialogStore();

  return (
    <Button size='sm' onClick={openAddDialog}>
      <Plus className='w-3 h-3 mr-1' />
      댓글 추가
    </Button>
  );
};
