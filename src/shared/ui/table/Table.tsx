export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto">
    <table 
      className={`table-fixed w-full caption-bottom text-sm ${className}`}
      {...props} 
    />
  </div>
);
