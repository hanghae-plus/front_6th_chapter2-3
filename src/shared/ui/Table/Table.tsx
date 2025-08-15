import React from 'react';

import { cn } from '../../lib/utils';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className='relative w-full overflow-auto'>
        <table
          ref={ref}
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        />
      </div>
    );
  }
);

Table.displayName = 'Table';

export default Table;
