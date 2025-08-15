import { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { BasePropsWithChildren } from '../../types/common';

export const DialogTitle = forwardRef<HTMLHeadingElement, BasePropsWithChildren>(
  ({ className, children, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  ),
);

DialogTitle.displayName = DialogPrimitive.Title.displayName;
