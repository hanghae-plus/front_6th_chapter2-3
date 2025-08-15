import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '../../../shared/ui';

interface CommentFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitText: string;
  currentValue: string;
  onValueChange: (value: string) => void;
  onSubmit: () => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({
  isOpen,
  onOpenChange,
  title,
  submitText,
  currentValue,
  onValueChange,
  onSubmit,
}) => {
  const handleSubmit = async () => {
    await onSubmit();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={currentValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onValueChange(e.target.value)
            }
          />
          <Button onClick={handleSubmit}>{submitText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentForm;
