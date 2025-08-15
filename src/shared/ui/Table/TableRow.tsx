import React from 'react';

import { cn } from '../../lib/utils';

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
          className
        )}
        {...props}
      />
    );
  }
);

TableRow.displayName = 'TableRow';

export default TableRow;
