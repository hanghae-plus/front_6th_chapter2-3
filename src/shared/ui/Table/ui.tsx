import type {
  ITableProps,
  ITableHeaderProps,
  ITableBodyProps,
  ITableRowProps,
  ITableHeadProps,
  ITableCellProps,
} from './type'

export const Table = ({ className, ref, ...props }: ITableProps) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
  </div>
)

export const TableHeader = ({ className, ref, ...props }: ITableHeaderProps) => (
  <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
)

export const TableBody = ({ className, ref, ...props }: ITableBodyProps) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
)

export const TableRow = ({ className, ref, ...props }: ITableRowProps) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    {...props}
  />
)

export const TableHead = ({ className, ref, ...props }: ITableHeadProps) => (
  <th
    ref={ref}
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
)

export const TableCell = ({ className, ref, ...props }: ITableCellProps) => (
  <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
)
