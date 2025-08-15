import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';

interface TableCellBodyProps extends BaseProps, React.HTMLAttributes<HTMLTableCellElement> {}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellBodyProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  ),
);
TableCell.displayName = 'TableCell';
