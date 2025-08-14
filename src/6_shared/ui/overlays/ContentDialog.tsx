import { ReactNode } from 'react';

import { DialogProps } from '@radix-ui/react-dialog';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './Dialog';

interface ContentDialogProps extends DialogProps {
  title: ReactNode;
}

export const ContentDialog = ({
  title,
  children,
  ...props
}: ContentDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
