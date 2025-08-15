import { Edit2 } from 'lucide-react';
import { useState } from 'react';

import { UpdateCommentModal } from './UpdateCommentModal';
import { CommentType } from '../../../entities';
import { Button } from '../../../shared';

interface UpdateCommentButtonProps {
  comment: CommentType;
}

export const UpdateCommentButton = ({ comment }: UpdateCommentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button variant='ghost' size='sm' onClick={handleOpenModal}>
        <Edit2 className='w-3 h-3' />
      </Button>
      <UpdateCommentModal isOpen={isOpen} onOpenChange={setIsOpen} originalComment={comment} />
    </>
  );
};
