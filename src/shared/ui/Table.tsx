import { cva, VariantProps } from "class-variance-authority"
import { forwardRef, HTMLAttributes } from "react"

// table
const tableVariants = cva("table-fixed w-full caption-bottom text-sm")

export interface TableProps extends HTMLAttributes<HTMLTableElement>, VariantProps<typeof tableVariants> {
  className?: string
}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={tableVariants({ className })} {...props} />
  </div>
))
Table.displayName = "Table"

// table header
const tableHeaderVariants = cva("[&_tr]:border-b")

export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableHeaderVariants> {
  className?: string
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => (
  <thead ref={ref} className={tableHeaderVariants({ className })} {...props} />
))
TableHeader.displayName = "TableHeader"

// table body
const tableBodyVariants = cva("[&_tr:last-child]:border-0")

export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableBodyVariants> {
  className?: string
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={tableBodyVariants({ className })} {...props} />
))
TableBody.displayName = "TableBody"

// table row
const tableRowVariants = cva("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14")

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement>, VariantProps<typeof tableRowVariants> {
  className?: string
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr ref={ref} className={tableRowVariants({ className })} {...props} />
))
TableRow.displayName = "TableRow"

// table head
const tableHeadVariants = cva(
  "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
)

export interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement>, VariantProps<typeof tableHeadVariants> {
  className?: string
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => (
  <th ref={ref} className={tableHeadVariants({ className })} {...props} />
))
TableHead.displayName = "TableHead"

// table cell
const tableCellVariants = cva("p-2 align-middle [&:has([role=checkbox])]:pr-0")

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement>, VariantProps<typeof tableCellVariants> {
  className?: string
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td ref={ref} className={tableCellVariants({ className })} {...props} />
))
TableCell.displayName = "TableCell"
