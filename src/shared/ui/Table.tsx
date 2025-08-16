interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
  ref?: React.Ref<HTMLTableElement>;
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  ref?: React.Ref<HTMLTableSectionElement>;
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  ref?: React.Ref<HTMLTableSectionElement>;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
  ref?: React.Ref<HTMLTableRowElement>;
}

interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string;
  ref?: React.Ref<HTMLTableCellElement>;
}

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string;
  ref?: React.Ref<HTMLTableCellElement>;
}

export const Table = ({ className, ref, ...props }: TableProps) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
  </div>
)
Table.displayName = "Table"

export const TableHeader = ({ className, ref, ...props }: TableHeaderProps) => (
  <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
)
TableHeader.displayName = "TableHeader"

export const TableBody = ({ className, ref, ...props }: TableBodyProps) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
)
TableBody.displayName = "TableBody"

export const TableRow = ({ className, ref, ...props }: TableRowProps) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    {...props}
  />
)
TableRow.displayName = "TableRow"

export const TableHead = ({ className, ref, ...props }: TableHeadProps) => (
  <th
    ref={ref}
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
)
TableHead.displayName = "TableHead"

export const TableCell = ({ className, ref, ...props }: TableCellProps) => (
  <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
)
TableCell.displayName = "TableCell"
