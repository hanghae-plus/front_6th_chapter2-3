import React from 'react';

import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // className 속성을 명시적으로 추가
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-card text-card-foreground rounded-lg border shadow-sm',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export default Card;
