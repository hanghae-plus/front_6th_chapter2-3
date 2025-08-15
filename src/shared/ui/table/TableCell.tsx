export const TableCell = ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
  <td 
    className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props} 
  />
);