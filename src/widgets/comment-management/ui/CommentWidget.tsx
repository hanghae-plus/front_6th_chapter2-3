import React from 'react';

import { CommentFormManager, CommentManager } from '../../../features/comment-management';

interface CommentWidgetProps {
  postId: number;
}

const CommentWidget: React.FC<CommentWidgetProps> = ({ postId }) => {
  return (
    <div className='space-y-4'>
      {/* 댓글 목록 및 관리 */}
      <CommentManager postId={postId} />
      
      {/* 댓글 추가 폼 */}
      <CommentFormManager mode='add' />
      
      {/* 댓글 수정 폼 */}
      <CommentFormManager mode='edit' />
    </div>
  );
};

export default CommentWidget;