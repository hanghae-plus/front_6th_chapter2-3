import { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { BaseProps } from '../../types/common';

interface DialogTitleProps extends BaseProps, React.ComponentProps<typeof DialogPrimitive.Title> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  ),
);

DialogTitle.displayName = DialogPrimitive.Title.displayName;
