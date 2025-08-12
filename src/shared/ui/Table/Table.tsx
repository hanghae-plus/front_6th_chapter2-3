import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';

interface TableProps extends BaseProps, React.HTMLAttributes<HTMLTableElement> {}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className='w-full overflow-auto'>
    <table
      ref={ref}
      className={`table-fixed w-full caption-bottom text-sm ${className}`}
      {...props}
    />
  </div>
));
