import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';

interface TableHeaderProps extends BaseProps, React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
  ),
);
TableHeader.displayName = 'TableHeader';
