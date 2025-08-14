import { Plus } from 'lucide-react';
import { Button, CardHeader, CardTitle } from '../../../shared/ui';
import { useDialogStore } from '../../../shared/store/dialog';
import { DIALOG_KEYS } from '../../../shared/constant/dialog';

export default function PostsHeader() {
  const { openDialog } = useDialogStore();
  return (
    <CardHeader>
      <CardTitle className='flex items-center justify-between'>
        <span>게시물 관리자</span>
        <Button onClick={() => openDialog(DIALOG_KEYS.ADD_POST)}>
          <Plus className='w-4 h-4 mr-2' />
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  );
}
