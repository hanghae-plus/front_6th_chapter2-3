import { MessageSquare } from 'lucide-react';

import { useViewPost } from '../model/useViewPost';

import { Post } from '@/entities/post/model/types';
import { Button } from '@/shared/ui';

interface ViewPostButtonProps {
  post: Post;
}

export const ViewPostButton = ({ post }: ViewPostButtonProps) => {
  const { openDialog } = useViewPost();

  return (
    <Button variant='ghost' size='sm' onClick={() => openDialog(post)}>
      <MessageSquare className='w-4 h-4' />
    </Button>
  );
};
