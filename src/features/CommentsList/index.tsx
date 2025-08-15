import { Plus, Edit2, Trash2, ThumbsUp } from 'lucide-react';
import React from 'react';

import {
  useCommentActions,
  useDialogState,
  useSelectionState,
} from '../../entities/post/model/hooks';
import { highlightText } from '../../shared/lib/highlightText';
import { Button } from '../../shared/ui';

type Props = {
  postId: number;
  searchQuery: string;
};

const CommentsList: React.FC<Props> = ({ postId, searchQuery }) => {
  const { comments, setSelectedComment, setNewComment } = useSelectionState();
  const { setShowAddCommentDialog, setShowEditCommentDialog } = useDialogState();
  const { deleteComment, likeComment } = useCommentActions();

  const onAddClick = (pid: number) => {
    setNewComment({ body: '', postId: pid, userId: 1 });
    setShowAddCommentDialog(true);
  };
  const onEdit = (comment: import('../../entities/post/model/types').Comment) => {
    setSelectedComment(comment);
    setShowEditCommentDialog(true);
  };
  const onDelete = (commentId: number, pid: number) => deleteComment(commentId, pid);
  const onLike = (commentId: number, pid: number) => likeComment(commentId, pid);
  return (
    <div className='mt-2'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-sm font-semibold'>댓글</h3>
        <Button size='sm' onClick={() => onAddClick(postId)}>
          <Plus className='w-3 h-3 mr-1' /> 댓글 추가
        </Button>
      </div>
      <div className='space-y-1'>
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className='flex items-center justify-between text-sm border-b pb-1'>
            <div className='flex items-center space-x-2 overflow-hidden'>
              <span className='font-medium truncate'>{comment.user.username}:</span>
              <span className='truncate'>{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className='flex items-center space-x-1'>
              <Button variant='ghost' size='sm' onClick={() => onLike(comment.id, postId)}>
                <ThumbsUp className='w-3 h-3' />
                <span className='ml-1 text-xs'>{comment.likes}</span>
              </Button>
              <Button variant='ghost' size='sm' onClick={() => onEdit(comment)}>
                <Edit2 className='w-3 h-3' />
              </Button>
              <Button variant='ghost' size='sm' onClick={() => onDelete(comment.id, postId)}>
                <Trash2 className='w-3 h-3' />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
