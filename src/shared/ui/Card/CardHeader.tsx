import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';

interface CardHeaderProps extends BaseProps, React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
  ),
);

CardHeader.displayName = 'CardHeader';
