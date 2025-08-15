import React from 'react';

import { cn } from '../../lib/utils';

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-2xl font-semibold leading-none tracking-tight',
          className
        )}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

export default CardTitle;
