function Table({ className = '', ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className='w-full overflow-auto'>
      <table className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
    </div>
  );
}
Table.displayName = 'Table';

function TableHeader({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`[&_tr]:border-b ${className}`} {...props} />;
}
TableHeader.displayName = 'TableHeader';

function TableBody({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />;
}
TableBody.displayName = 'TableBody';

function TableRow({ className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
      {...props}
    />
  );
}
TableRow.displayName = 'TableRow';

function TableHead({ className = '', ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}
TableHead.displayName = 'TableHead';

function TableCell({ className = '', ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
  );
}
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
