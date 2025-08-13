import { Edit2 } from 'lucide-react';

import { useEditPost } from '../model/useEditPost';

import { Post } from '@/entities/post/model/types';
import { Button } from '@/shared/ui';

interface EditPostButtonProps {
  post: Post;
}

export const EditPostButton = ({ post }: EditPostButtonProps) => {
  const { setShowDialog } = useEditPost(post);

  return (
    <Button variant='ghost' size='sm' onClick={() => setShowDialog(true)}>
      <Edit2 className='w-4 h-4' />
    </Button>
  );
};
