import { useState } from 'react';

import { CommentType, useUpdateComment } from '../../../entities';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '../../../shared';

interface UpdateCommentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  originalComment: CommentType;
}

export const UpdateCommentModal = ({
  isOpen,
  onOpenChange,
  originalComment,
}: UpdateCommentModalProps) => {
  const [selectedComment, setSelectedComment] = useState(originalComment);
  const { mutate: updateComment } = useUpdateComment();

  const handleUpdateComment = () => {
    updateComment({
      id: selectedComment.id,
      body: selectedComment.body,
      postId: selectedComment.postId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
          <DialogDescription>댓글 내용을 수정합니다.</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={selectedComment?.body || ''}
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
