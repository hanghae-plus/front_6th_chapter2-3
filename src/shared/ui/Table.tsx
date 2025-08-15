import * as React from "react"

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string
}

export const Table = ({ className, ref, ...props }: TableProps & { ref?: React.Ref<HTMLTableElement> }) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
  </div>
)

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export const TableHeader = ({
  className,
  ref,
  ...props
}: TableHeaderProps & { ref?: React.Ref<HTMLTableSectionElement> }) => (
  <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
)

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

export const TableBody = ({
  className,
  ref,
  ...props
}: TableBodyProps & { ref?: React.Ref<HTMLTableSectionElement> }) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
)

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
}

export const TableRow = ({ className, ref, ...props }: TableRowProps & { ref?: React.Ref<HTMLTableRowElement> }) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    {...props}
  />
)

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string
}

export const TableHead = ({ className, ref, ...props }: TableHeadProps & { ref?: React.Ref<HTMLTableCellElement> }) => (
  <th
    ref={ref}
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
)

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string
}

export const TableCell = ({ className, ref, ...props }: TableCellProps & { ref?: React.Ref<HTMLTableCellElement> }) => (
  <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
)
