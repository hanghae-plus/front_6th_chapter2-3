import { ThumbsUp } from 'lucide-react';

import { Comment } from '@/entities/comment/model/types';
import { useLikeComment } from '@/entities/comment/model/useComments';
import { Button } from '@/shared/ui';

export const LikeButton = ({ comment }: { comment: Comment }) => {
  const { mutate: likeComment } = useLikeComment();

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => likeComment({ commentId: comment.id, currentLikes: comment.likes })}
    >
      <ThumbsUp className='w-3 h-3' />
      <span className='ml-1 text-xs'>{comment.likes}</span>
    </Button>
  );
};
