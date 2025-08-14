import { Plus } from 'lucide-react';
import { useAddPostDialog } from '../model';
import { Button } from '@/shared/ui';

export const AddPostButton = () => {
  const { open: openAddPostDialog } = useAddPostDialog();

  return (
    <Button onClick={() => openAddPostDialog()}>
      <Plus className="w-4 h-4 mr-2" />
      게시물 추가
    </Button>
  );
};
