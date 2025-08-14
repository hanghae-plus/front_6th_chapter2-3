import { Button } from '@/shared/ui';
import { postApi } from '@/entities/post';
import { Trash2 } from 'lucide-react';

type DeletePostButtonProps = {
  postId: number;
  onDeleted?: () => void;
};

export function DeletePostButton({ postId, onDeleted }: DeletePostButtonProps) {
  const onClick = async () => {
    await postApi.deletePost(postId);
    onDeleted?.();
  };

  return (
    <Button variant='ghost' size='sm' onClick={onClick}>
      <Trash2 className='w-4 h-4' />
    </Button>
  );
}
