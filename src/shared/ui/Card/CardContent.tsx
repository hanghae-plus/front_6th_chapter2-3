import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';

interface CardContentProps extends BaseProps, React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
  ),
);
CardContent.displayName = 'CardContent';
