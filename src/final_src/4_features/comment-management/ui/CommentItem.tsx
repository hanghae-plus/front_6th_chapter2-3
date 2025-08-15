import { Edit2, ThumbsUp, Trash2 } from 'lucide-react';

import {
  Comment,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} from '@/entities/comment';
import { UI_CONSTANTS } from '@/shared/constants';
import { highlightText, usePostsFilterStore, useUIStore } from '@/shared/lib';
import { Button } from '@/shared/ui';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { setSelectedComment, setShowEditCommentDialog } = useUIStore();
  const { searchQuery } = usePostsFilterStore();
  const { mutate: likeComment, isPending } = useLikeCommentMutation({
    onError: error => {
      console.error('댓글 좋아요 오류:', error);
    },
  });
  const { mutate: deleteComment, isPending: isDeleting } =
    useDeleteCommentMutation({
      onError: error => {
        console.error('댓글 삭제 오류:', error);
      },
    });

  const handleClickLikeComment = () => {
    if (isPending) return;
    likeComment({ commentId: comment.id, postId: comment.postId });
  };

  const handleClickEditComment = () => {
    setSelectedComment(comment);
    setShowEditCommentDialog(true);
  };

  const handleClickDeleteComment = () => {
    if (isDeleting) return;
    deleteComment({ commentId: comment.id, postId: comment.postId });
  };

  return (
    <div className='flex items-center justify-between text-sm border-b pb-1 gap-2'>
      <div className='flex items-center space-x-2 min-w-0 flex-1'>
        <span className='font-medium shrink-0'>{comment.user.username}:</span>
        <span className='truncate'>
          {highlightText(comment.body, searchQuery)}
        </span>
      </div>
      <div className='flex items-center space-x-1 shrink-0'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => handleClickLikeComment()}
        >
          <ThumbsUp className={UI_CONSTANTS.ICON_SIZES.SMALL} />
          <span className='ml-1 text-xs'>{comment.likes}</span>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => handleClickEditComment()}
        >
          <Edit2 className={UI_CONSTANTS.ICON_SIZES.SMALL} />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => handleClickDeleteComment()}
        >
          <Trash2 className={UI_CONSTANTS.ICON_SIZES.SMALL} />
        </Button>
      </div>
    </div>
  );
};
