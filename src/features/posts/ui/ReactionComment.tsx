import { ThumbsUp } from 'lucide-react';
import { usePostCommentLike } from '../model';
import { Button } from '@/shared/ui';

interface ReactionCommentProps {
  commentId: number;
  postId: number;
  likes: number;
}

export const ReactionComment = ({
  commentId,
  postId,
  likes,
}: ReactionCommentProps) => {
  const { mutate: likeComment } = usePostCommentLike();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => likeComment({ commentId: commentId, postId: postId })}
    >
      <ThumbsUp className="w-3 h-3" />
      <span className="ml-1 text-xs">{likes}</span>
    </Button>
  );
};
