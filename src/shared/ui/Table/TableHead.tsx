import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';

interface TableHeadBodyProps extends BaseProps, React.HTMLAttributes<HTMLTableCellElement> {}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadBodyProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  ),
);
TableHead.displayName = 'TableHead';
