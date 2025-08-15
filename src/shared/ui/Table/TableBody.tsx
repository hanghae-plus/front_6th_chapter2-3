import React from 'react';

import { cn } from '../../lib/utils';

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn('[&_tr:last-child]:border-0', className)}
        {...props}
      />
    );
  }
);

TableBody.displayName = 'TableBody';

export default TableBody;
