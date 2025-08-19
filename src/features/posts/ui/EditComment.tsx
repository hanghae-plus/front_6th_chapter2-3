import { useEditCommentDialog } from '../model';
import { Edit2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEditComment } from '../model';
import type { PostComment } from '@/entities/posts';
import { Button } from '@/shared/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@/shared/ui';

interface EditCommentButtonProps {
  comment: PostComment;
}

// 댓글 수정 버튼
export const EditCommentButton = ({ comment }: EditCommentButtonProps) => {
  const { open: openEditCommentDialog } = useEditCommentDialog();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        openEditCommentDialog(comment);
      }}
    >
      <Edit2 className="w-3 h-3" />
    </Button>
  );
};

// 댓글 수정 다이얼로그
export const EditCommentDialog = () => {
  const [body, setBody] = useState('');
  const { opened, data: commentData, close } = useEditCommentDialog();
  const { mutate: updateComment } = useEditComment();

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
