import { Trash2 } from 'lucide-react';
import { usePostCommentDelete } from '../model';
import { Button } from '@/shared/ui';

interface DeleteCommentButtonProps {
  commentId: number;
  postId: number;
}

export const DeleteCommentButton = ({
  commentId,
  postId,
}: DeleteCommentButtonProps) => {
  const { mutate: deleteComment } = usePostCommentDelete();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() =>
        deleteComment({
          commentId,
          postId,
        })
      }
    >
      <Trash2 className="w-3 h-3" />
    </Button>
  );
};
