import { Plus } from 'lucide-react';
import { useState } from 'react';

import { CreatePostModal } from './CreatePostModal';
import { Button } from '../../../shared';

export const CreatePostButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpenModal}>
        <Plus className='w-4 h-4 mr-2' />
        게시물 추가
      </Button>
      <CreatePostModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
