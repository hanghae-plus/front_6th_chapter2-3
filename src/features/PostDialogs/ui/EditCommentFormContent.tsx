import React from 'react';

import { Button, Textarea } from '../../../shared/ui';

export const EditCommentFormContent: React.FC<{
  selectedComment: { id: number; body: string } | null;
  setSelectedComment: (v: { id: number; body: string }) => void;
  onSubmit: () => void;
}> = ({ selectedComment, setSelectedComment, onSubmit }) => (
  <div className='space-y-4'>
    <Textarea
      placeholder='댓글 내용'
      value={selectedComment?.body || ''}
      onChange={(e) =>
        selectedComment && setSelectedComment({ ...selectedComment, body: e.target.value })
      }
    />
    <Button onClick={onSubmit}>댓글 업데이트</Button>
  </div>
);
