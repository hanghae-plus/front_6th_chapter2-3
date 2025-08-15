import { useState } from 'react';

import { useCreateComment } from '../../../entities';
import {
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogTitle,
  Textarea,
  Button,
} from '../../../shared';

interface CreateCommentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number;
}

export const CreateCommentModal = ({ isOpen, onOpenChange, postId }: CreateCommentModalProps) => {
  const [newComment, setNewComment] = useState({ body: '', postId, userId: 1 });
  const { mutate: createComment } = useCreateComment();

  const handleAddComment = () => {
    createComment(newComment);
    onOpenChange(false);
    setNewComment({ body: '', postId, userId: 1 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
          <DialogDescription>선택한 게시물에 댓글을 추가합니다.</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
