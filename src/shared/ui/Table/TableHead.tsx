import React from 'react';

import { cn } from '../../lib/utils';

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
          className
        )}
        {...props}
      />
    );
  }
);

TableHead.displayName = 'TableHead';

export default TableHead;
