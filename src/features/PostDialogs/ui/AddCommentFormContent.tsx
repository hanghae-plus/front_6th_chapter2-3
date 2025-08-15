import React from 'react';

import { Button, Textarea } from '../../../shared/ui';

export const AddCommentFormContent: React.FC<{
  newComment: { body: string; postId: number | null; userId: number };
  setNewComment: (v: { body: string; postId: number | null; userId: number }) => void;
  onSubmit: () => void;
}> = ({ newComment, setNewComment, onSubmit }) => (
  <div className='space-y-4'>
    <Textarea
      placeholder='댓글 내용'
      value={newComment.body}
      onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
    />
    <Button onClick={onSubmit}>댓글 추가</Button>
  </div>
);
