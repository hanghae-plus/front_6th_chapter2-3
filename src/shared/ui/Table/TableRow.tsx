import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';

interface TableRowProps extends BaseProps, React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';
