import { Edit2 } from 'lucide-react';

import { useCommentDialogStore } from '@/entities/comment/model/commentDialogStore';
import { Comment } from '@/entities/comment/model/types';
import { Button } from '@/shared/ui';

export const EditCommentButton = ({ comment }: { comment: Comment }) => {
  const { openEditDialog } = useCommentDialogStore();

  return (
    <Button variant='ghost' size='sm' onClick={() => openEditDialog(comment)}>
      <Edit2 className='w-3 h-3' />
    </Button>
  );
};
