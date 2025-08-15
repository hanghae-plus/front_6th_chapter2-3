import { Button } from '../../../shared/ui';
import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react';
import { Comment } from '../../../entities/comment';
import { highlightText } from '../../../shared/utils';
import { useComments } from '../hooks/useCommentQueries';

interface CommentListProps {
  postId: number;
  searchQuery: string;
  onAddComment: () => void;
  onEditComment: (comment: Comment) => void;
  onLikeComment: (id: number, postId: number) => void;
  onDeleteComment: (id: number, postId: number) => void;
}

export const CommentList = ({
  postId,
  searchQuery,
  onAddComment,
  onEditComment,
  onLikeComment,
  onDeleteComment,
}: CommentListProps) => {
  // TanStack Query로 댓글 데이터 가져오기
  const { data: commentsData, isLoading, error } = useComments(postId);

  const comments = commentsData?.comments || [];

  if (isLoading) {
    return (
      <div className='mt-2'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-sm font-semibold'>댓글</h3>
          <Button size='sm' onClick={onAddComment}>
            <Plus className='w-3 h-3 mr-1' />
            댓글 추가
          </Button>
        </div>
        <div className='text-sm text-gray-500'>댓글을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mt-2'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-sm font-semibold'>댓글</h3>
          <Button size='sm' onClick={onAddComment}>
            <Plus className='w-3 h-3 mr-1' />
            댓글 추가
          </Button>
        </div>
        <div className='text-sm text-red-500'>댓글을 불러오는 중 오류가 발생했습니다.</div>
      </div>
    );
  }

  return (
    <div className='mt-2'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-sm font-semibold'>댓글</h3>
        <Button size='sm' onClick={onAddComment}>
          <Plus className='w-3 h-3 mr-1' />
          댓글 추가
        </Button>
      </div>
      <div className='space-y-1'>
        {comments.length === 0 ? (
          <div className='text-sm text-gray-500'>댓글이 없습니다.</div>
        ) : (
          comments.map((comment: Comment) => (
            <div
              key={comment.id}
              className='flex items-center justify-between text-sm border-b pb-1'
            >
              <div className='flex items-center space-x-2 overflow-hidden'>
                <span className='font-medium truncate'>{comment.user.username}:</span>
                <span className='truncate'>{highlightText(comment.body, searchQuery)}</span>
              </div>
              <div className='flex items-center space-x-1'>
                <Button variant='ghost' size='sm' onClick={() => onLikeComment(comment.id, postId)}>
                  <ThumbsUp className='w-3 h-3' />
                  <span className='ml-1 text-xs'>{comment.likes}</span>
                </Button>
                <Button variant='ghost' size='sm' onClick={() => onEditComment(comment)}>
                  <Edit2 className='w-3 h-3' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onDeleteComment(comment.id, postId)}
                >
                  <Trash2 className='w-3 h-3' />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
