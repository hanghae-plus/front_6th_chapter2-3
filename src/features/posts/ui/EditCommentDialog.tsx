import { useEffect, useState } from 'react';
import { useEditCommentDialog } from '../model';
import { useUpdatePostComment } from '@/entities/posts';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@/shared/ui';

export const EditCommentDialog = () => {
  const [body, setBody] = useState('');
  const { opened, data: commentData, close } = useEditCommentDialog();
  const { mutate: updateComment } = useUpdatePostComment();

  useEffect(() => {
    setBody(commentData?.body || '');
  }, [commentData?.body]);

  if (!commentData) {
    return null;
  }

  return (
    <Dialog
      open={opened}
      onOpenChange={(opened) => {
        if (!opened) {
          close();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button
            onClick={() => {
              updateComment({
                commentId: commentData.id,
                postId: commentData.postId,
                commentData: { body },
              });
              close();
            }}
          >
            댓글 업데이트
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
