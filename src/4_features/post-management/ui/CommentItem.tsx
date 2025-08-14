import { Edit2, ThumbsUp } from 'lucide-react';

import { Comment } from '@/entities/comment';
import { UI_CONSTANTS } from '@/shared/constants';
import { highlightText, useUIStore } from '@/shared/lib';
import { Button } from '@/shared/ui';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { searchQuery } = useUIStore();

  return (
    <div
      key={comment.id}
      className='flex items-center justify-between text-sm border-b pb-1'
    >
      <div className='flex items-center space-x-2 overflow-hidden'>
        <span className='font-medium truncate'>{comment.user.username}:</span>
        <span className='truncate'>
          {highlightText(comment.body, searchQuery)}
        </span>
      </div>
      <div className='flex items-center space-x-1'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => likeComment(comment.id, postId)}
        >
          <ThumbsUp className={UI_CONSTANTS.ICON_SIZES.SMALL} />
          <span className='ml-1 text-xs'>{comment.likes}</span>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => {
            setSelectedComment(comment);
            setShowEditCommentDialog(true);
          }}
        >
          <Edit2 className={UI_CONSTANTS.ICON_SIZES.SMALL} />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => deleteComment(comment.id, postId)}
        >
          <Trash2 className={UI_CONSTANTS.ICON_SIZES.SMALL} />
        </Button>
      </div>
    </div>
  );
};
