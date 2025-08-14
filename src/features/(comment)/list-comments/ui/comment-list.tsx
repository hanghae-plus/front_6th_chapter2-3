import { Button } from '@/shared/ui';
import type { Comment } from '@/entities/comment';

type CommentListProps = {
  comments: Comment[];
  onLike: (id: number) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (id: number) => void;
};

export function CommentList({ comments, onLike, onEdit, onDelete }: CommentListProps) {
  return (
    <div className='space-y-1'>
      {comments.map((comment) => (
        <div key={comment.id} className='flex items-center justify-between text-sm border-b pb-1'>
          <div className='flex items-center space-x-2 overflow-hidden'>
            <span className='font-medium truncate'>{comment.user.username}:</span>
            <span className='truncate'>{comment.body}</span>
          </div>
          <div className='flex items-center space-x-1'>
            <Button variant='ghost' size='sm' onClick={() => onLike(comment.id)}>
              좋아요 <span className='ml-1 text-xs'>{comment.likes ?? 0}</span>
            </Button>
            <Button variant='ghost' size='sm' onClick={() => onEdit(comment)}>
              수정
            </Button>
            <Button variant='ghost' size='sm' onClick={() => onDelete(comment.id)}>
              삭제
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
