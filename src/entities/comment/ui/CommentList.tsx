import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react';

import { useDeleteComment, useFetchComments, useLikeComment } from '../model/useComments';

import { useCommentDialogStore } from '@/entities/comment/model/commentDialogStore';
import { useViewPostStore } from '@/features/post-view/model/viewPostStore';
import { Button, HighlightText } from '@/shared/ui';

export const CommentList = () => {
  const { postToView } = useViewPostStore();
  const { data: comments } = useFetchComments(postToView?.id || null);

  const { openAddDialog, openEditDialog } = useCommentDialogStore();

  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: likeComment } = useLikeComment();

  if (!comments) return null;

  return (
    <div className='mt-2'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-sm font-semibold'>댓글</h3>
        <Button size='sm' onClick={openAddDialog}>
          <Plus className='w-3 h-3 mr-1' />
          댓글 추가
        </Button>
      </div>
      <div className='space-y-1'>
        {comments.map((comment) => (
          <div key={comment.id} className='flex items-center justify-between text-sm border-b pb-1'>
            <div className='flex items-center space-x-2 overflow-hidden'>
              <span className='font-medium truncate'>{comment.user.username}:</span>
              <span className='truncate'>
                <HighlightText text={comment.body} />
              </span>
            </div>
            <div className='flex items-center space-x-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => likeComment({ commentId: comment.id, currentLikes: comment.likes })}
              >
                <ThumbsUp className='w-3 h-3' />
                <span className='ml-1 text-xs'>{comment.likes}</span>
              </Button>
              <Button variant='ghost' size='sm' onClick={() => openEditDialog(comment)}>
                <Edit2 className='w-3 h-3' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => deleteComment({ commentId: comment.id })}
              >
                <Trash2 className='w-3 h-3' />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
