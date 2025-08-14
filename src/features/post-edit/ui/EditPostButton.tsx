import { Edit2 } from 'lucide-react';

import { useEditPostStore } from '../model/editPostStore';

import { Post } from '@/entities/post/model/types';
import { Button } from '@/shared/ui';

interface EditPostButtonProps {
  post: Post;
}

export const EditPostButton = ({ post }: EditPostButtonProps) => {
  const { openDialog } = useEditPostStore();

  return (
    <Button variant='ghost' size='sm' onClick={() => openDialog(post)}>
      <Edit2 className='w-4 h-4' />
    </Button>
  );
};
