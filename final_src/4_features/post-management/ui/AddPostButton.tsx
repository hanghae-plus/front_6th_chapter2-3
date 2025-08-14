import { Plus } from 'lucide-react';

import { UI_CONSTANTS } from '@/shared/constants';
import { useUIStore } from '@/shared/lib';
import { Button } from '@/shared/ui';

export const AddPostButton = () => {
  const { setShowAddDialog } = useUIStore();

  return (
    <Button onClick={() => setShowAddDialog(true)}>
      <Plus className={`${UI_CONSTANTS.ICON_SIZES.MEDIUM} mr-2`} />
      게시물 추가
    </Button>
  );
};
