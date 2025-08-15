import { Trash2 } from 'lucide-react';

import { useDeleteComment } from '@/entities/comment/model/useComments';
import { Button } from '@/shared/ui';

export const DeleteCommentButton = ({ commentId }: { commentId: number }) => {
  const { mutate: deleteComment } = useDeleteComment();

  return (
    <Button variant='ghost' size='sm' onClick={() => deleteComment({ commentId })}>
      <Trash2 className='w-3 h-3' />
    </Button>
  );
};
