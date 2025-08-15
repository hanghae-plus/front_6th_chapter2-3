export const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead 
    className={`[&_tr]:border-b ${className}`}
    {...props} 
  />
);