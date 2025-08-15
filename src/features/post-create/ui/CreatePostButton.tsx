import { Plus } from 'lucide-react';

import { useCreatePost } from '../model/useCreatePost';

import { Button } from '@/shared/ui';

export const CreatePostButton = () => {
  const { openDialog } = useCreatePost();

  return (
    <Button onClick={openDialog}>
      <Plus className='w-4 h-4 mr-2' />
      게시물 추가
    </Button>
  );
};
