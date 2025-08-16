import { Plus } from 'lucide-react';
import { useState } from 'react';

import { CreateCommentModal } from './CreateCommentModal';
import { Button } from '../../../shared';

interface CreateCommentButtonProps {
  postId: number;
}

export const CreateCommentButton = ({ postId }: CreateCommentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenCreateCommentDialog = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <>
      <Button
        size='sm'
        onClick={() => {
          handleOpenCreateCommentDialog(true);
        }}
      >
        <Plus className='w-3 h-3 mr-1' />
        댓글 추가
      </Button>
      <CreateCommentModal isOpen={isOpen} onOpenChange={setIsOpen} postId={postId} />
    </>
  );
};
