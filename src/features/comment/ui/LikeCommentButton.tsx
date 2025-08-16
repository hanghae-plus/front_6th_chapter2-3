import { ThumbsUp } from 'lucide-react';

import { useLikeComment } from '../../../entities';
import { Button } from '../../../shared';

interface LikeCommentButtonProps {
  commentId: number;
  postId: number;
  likes: number;
}

export const LikeCommentButton = ({ commentId, postId, likes }: LikeCommentButtonProps) => {
  const { mutate: likeComment } = useLikeComment();

  return (
    <Button variant='ghost' size='sm' onClick={() => likeComment({ commentId, postId })}>
      <ThumbsUp className='w-3 h-3' />
      <span className='ml-1 text-xs'>{likes}</span>
    </Button>
  );
};
