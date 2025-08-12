import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui';

interface CreatePostButtonProps {
  onClick: () => void;
}

export const CreatePostButton = ({ onClick }: CreatePostButtonProps) => (
  <Button onClick={onClick}>
    <Plus className='w-4 h-4 mr-2' />
    게시물 추가
  </Button>
);
