import { Plus } from 'lucide-react';
import { useAddCommentDialog } from '../model';
import { useState } from 'react';
import { useAddPostComment } from '../model';
import { Button } from '@/shared/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@/shared/ui';

interface AddCommentButtonProps {
  postId: number;
  userId: number;
}

// 댓글 추가 버튼
export const AddCommentButton = ({ postId, userId }: AddCommentButtonProps) => {
  const { open: openAddCommentDialog } = useAddCommentDialog();

  return (
    <Button
      size="sm"
      onClick={() => {
        openAddCommentDialog({ postId, userId });
      }}
    >
      <Plus className="w-3 h-3 mr-1" />
      댓글 추가
    </Button>
  );
};

// 댓글 추가 다이얼로그
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
