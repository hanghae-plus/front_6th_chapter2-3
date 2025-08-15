import React from 'react';

import { cn } from '../../lib/utils';

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn('[&_tr]:border-b', className)}
        {...props}
      />
    );
  }
);

TableHeader.displayName = 'TableHeader';

export default TableHeader;
