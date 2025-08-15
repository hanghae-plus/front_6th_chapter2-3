import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';

interface TableBodyProps extends BaseProps, React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
  ),
);
TableBody.displayName = 'TableBody';
