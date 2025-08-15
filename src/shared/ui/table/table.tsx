import type {
  TableBodyProps,
  TableCellProps,
  TableHeaderProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
} from "./table.type"

export const Table = ({ className, ref, ...props }: TableProps) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
  </div>
)

export const TableHeader = ({ className, ref, ...props }: TableHeaderProps) => (
  <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
)

export const TableBody = ({ className, ref, ...props }: TableBodyProps) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
)

export const TableRow = ({ className, ref, ...props }: TableRowProps) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    {...props}
  />
)

export const TableHead = ({ className, ref, ...props }: TableHeadProps) => (
  <th
    ref={ref}
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
)

export const TableCell = ({ className, ref, ...props }: TableCellProps) => (
  <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
)

Table.displayName = "Table"
TableHeader.displayName = "TableHeader"
TableBody.displayName = "TableBody"
TableRow.displayName = "TableRow"
TableHead.displayName = "TableHead"
TableCell.displayName = "TableCell"
