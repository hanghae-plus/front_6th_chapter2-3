import { ReactNode } from 'react';

import { DialogProps } from '@radix-ui/react-dialog';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './Dialog';

interface ContentDialogProps extends DialogProps {
  title: ReactNode;
  onClose?: () => void;
}

export const ContentDialog = ({
  title,
  children,
  onClose,
  onOpenChange,
  ...props
}: ContentDialogProps) => {
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    if (!open) {
      onClose?.();
    }
  };

  return (
    <Dialog {...props} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
