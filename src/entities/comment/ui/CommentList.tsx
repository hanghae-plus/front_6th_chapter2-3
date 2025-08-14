import { ReactNode } from 'react';

import { Comment } from '../model/types';

import { HighlightText } from '@/shared/ui';

interface CommentListProps {
  comments: Comment[];
  renderActions: (comment: Comment) => ReactNode;
}

export const CommentList = ({ comments, renderActions }: CommentListProps) => {
  return (
    <div className='space-y-1'>
      {comments.map((comment) => (
        <div key={comment.id} className='flex items-center justify-between text-sm border-b pb-1'>
          <div className='flex items-center space-x-2 overflow-hidden'>
            <span className='font-medium truncate'>{comment.user.username}:</span>
            <span className='truncate'>
              <HighlightText text={comment.body} />
            </span>
          </div>
          <div className='flex items-center space-x-1'>{renderActions(comment)}</div>
        </div>
      ))}
    </div>
  );
};
