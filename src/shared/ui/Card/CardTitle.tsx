import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';

interface CardTitleProps extends BaseProps, React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';
