import React from 'react';

import { cn } from '../../lib/utils';

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          'p-4 align-middle [&:has([role=checkbox])]:pr-0',
          className
        )}
        {...props}
      />
    );
  }
);

TableCell.displayName = 'TableCell';

export default TableCell;
