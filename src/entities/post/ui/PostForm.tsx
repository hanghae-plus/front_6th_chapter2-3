import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '../../../shared/ui';
import { UpdatePost } from '../model';

interface PostFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  title: string;
  body: string;
  userId?: number;
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onUserIdChange?: (value: string) => void;
  onSubmit: () => Promise<void>;
}

const PostForm: React.FC<PostFormProps> = ({
  isOpen,
  onOpenChange,
  mode,
  title: currentTitle,
  body: currentBody,
  userId: currentUserId,
  onTitleChange,
  onBodyChange,
  onUserIdChange,
  onSubmit,
}) => {
  const handleSubmit = async () => {
    await onSubmit();
    onOpenChange(false);
  };

  const submitText = mode === 'add' ? '게시물 추가' : '게시물 업데이트';
  const dialogTitle = mode === 'add' ? '새 게시물 추가' : '게시물 수정';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='제목'
            value={currentTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onTitleChange(e.target.value)
            }
          />
          <Textarea
            rows={30}
            placeholder='내용'
            value={currentBody}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onBodyChange(e.target.value)
            }
          />
          {mode === 'add' && onUserIdChange && (
            <Input
              type='number'
              placeholder='사용자 ID'
              value={currentUserId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUserIdChange(e.target.value)
              }
            />
          )}
          <Button onClick={handleSubmit}>{submitText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostForm;
