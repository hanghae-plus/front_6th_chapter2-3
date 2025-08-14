import { MessageSquare } from 'lucide-react';

import { Button } from '@/shared/ui';

interface DeletePostButtonProps {
  postId: number;
}

export const ViewPostButton = ({ postId }: DeletePostButtonProps) => {
  function openPostDetail(post: any): void {}

  return (
    <Button variant='ghost' size='sm' onClick={() => openPostDetail(post)}>
      <MessageSquare className='w-4 h-4' />
    </Button>
  );
};
