import { useState } from 'react';
import { useAddCommentDialog } from '../model';
import { useAddPostComment } from '@/entities/posts';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@/shared/ui';

export const AddCommentDialog = () => {
  const [body, setBody] = useState('');
  const { opened, data: addCommentData, close } = useAddCommentDialog();
  const { mutate: addComment } = useAddPostComment();

  if (!addCommentData) {
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
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              addComment({
                body,
                ...addCommentData,
              });
              close();
            }}
          >
            댓글 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
