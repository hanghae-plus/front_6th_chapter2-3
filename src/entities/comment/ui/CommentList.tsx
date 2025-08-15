import { Plus } from 'lucide-react';

import { Button } from '../../../shared/ui';
import { Comment } from '../model';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  postId: number;
  searchQuery?: string;
  onAddComment: () => void;
  onEditComment: (comment: Comment) => void;
  onDeleteComment: (commentId: number, postId: number) => void;
  onLikeComment: (commentId: number, postId: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  postId,
  searchQuery = '',
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}) => {

  return (
    <div className='mt-2'>
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-sm font-semibold'>댓글</h3>
        <Button size='sm' onClick={onAddComment}>
          <Plus className='mr-1 h-3 w-3' />
          댓글 추가
        </Button>
      </div>
      <div className='space-y-1'>
        {comments?.map((comment: Comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            postId={postId}
            searchQuery={searchQuery}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            onLike={onLikeComment}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
