import { Edit2 } from 'lucide-react';
import { useState } from 'react';

import { UpdatePostModal } from './UpdatePostModal';
import { PostType } from '../../../entities';
import { Button } from '../../../shared';

interface UpdatePostButtonProps {
  post: PostType;
}

export const UpdatePostButton = ({ post }: UpdatePostButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(post);

  const handleOpenModal = () => {
    setSelectedPost(post);
    setIsOpen(true);
  }

  // 게시물 수정 시
  const handleChangePost = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedPost({ ...selectedPost, [name]: value });
  };

  return (
    <>
      <Button variant='ghost' size='sm' onClick={handleOpenModal}>
        <Edit2 className='w-4 h-4' />
      </Button>
      <UpdatePostModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedPost={selectedPost}
        handleChangePost={handleChangePost}
      />
    </>
  );
};
