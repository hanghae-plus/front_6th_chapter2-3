import { Edit2, ThumbsUp, Trash2 } from 'lucide-react';

import React from 'react';

import { highlightText } from '../../../shared/lib';
import { Button } from '../../../shared/ui';
import { Comment } from '../model';

interface CommentItemProps {
  comment: Comment;
  postId: number;
  searchQuery?: string;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: number, postId: number) => void;
  onLike?: (commentId: number, postId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  postId,
  searchQuery = '',
  onEdit,
  onDelete,
  onLike 
}) => {

  const handleEdit = () => {
    if (onEdit) {
      onEdit(comment);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment.id, postId);
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(comment.id, postId);
    }
  };

  return (
    <div className='flex items-center justify-between border-b pb-1 text-sm'>
      <div className='flex items-center space-x-2 overflow-hidden'>
        <span className='truncate font-medium'>{comment.user.username}:</span>
        <span className='truncate'>
          {highlightText(comment.body, searchQuery)}
        </span>
      </div>
      <div className='flex items-center space-x-1'>
        <Button variant='ghost' size='sm' onClick={handleLike}>
          <ThumbsUp className='h-3 w-3' />
          <span className='ml-1 text-xs'>{comment.likes}</span>
        </Button>
        <Button variant='ghost' size='sm' onClick={handleEdit}>
          <Edit2 className='h-3 w-3' />
        </Button>
        <Button variant='ghost' size='sm' onClick={handleDelete}>
          <Trash2 className='h-3 w-3' />
        </Button>
      </div>
    </div>
  );
};

export default CommentItem;
