import { Plus } from 'lucide-react';
import { useDialogStore } from '../model';

import { Button } from '@/shared/ui/button';

const PostAddTrigger = () => {
  const { setShowAddDialog } = useDialogStore();
  return (
    <Button onClick={() => setShowAddDialog(true)}>
      <Plus className="w-4 h-4 mr-2" />
      게시물 추가
    </Button>
  );
};

export default PostAddTrigger;
