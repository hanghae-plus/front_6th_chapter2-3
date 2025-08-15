import * as React from "react"
import { forwardRef } from "react"

export const Table = forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement> & { className?: string }>(
  ({ className = "", ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table className={`table-fixed w-full caption-bottom text-sm ${className}`} ref={ref} {...props} />
    </div>
  ),
)
Table.displayName = "Table"

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { className?: string }
>(({ className = "", ...props }, ref) => <thead className={`[&_tr]:border-b ${className}`} ref={ref} {...props} />)
TableHeader.displayName = "TableHeader"

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { className?: string }
>(({ className = "", ...props }, ref) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} ref={ref} {...props} />
))
TableBody.displayName = "TableBody"

export const TableRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { className?: string }
>(({ className = "", ...props }, ref) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    ref={ref}
    {...props}
  />
))
TableRow.displayName = "TableRow"

export const TableHead = forwardRef<
  HTMLTableHeaderCellElement,
  React.ThHTMLAttributes<HTMLTableHeaderCellElement> & { className?: string }
>(({ className = "", ...props }, ref) => (
  <th
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    ref={ref}
    {...props}
  />
))
TableHead.displayName = "TableHead"

export const TableCell = forwardRef<
  HTMLTableDataCellElement,
  React.TdHTMLAttributes<HTMLTableDataCellElement> & { className?: string }
>(({ className = "", ...props }, ref) => (
  <td className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} ref={ref} {...props} />
))
TableCell.displayName = "TableCell"
