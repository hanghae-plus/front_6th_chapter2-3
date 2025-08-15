export const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody 
    className={`[&_tr:last-child]:border-0 ${className}`}
    {...props} 
  />
);