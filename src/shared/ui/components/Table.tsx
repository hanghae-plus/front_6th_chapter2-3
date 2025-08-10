import * as React from "react"
import { forwardRef } from "react"

// 테이블 컴포넌트
interface TableProps extends React.ComponentPropsWithoutRef<"table"> {
  className?: string
}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className = "", children, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props}>
      {children}
    </table>
  </div>
))
Table.displayName = "Table"

// 테이블 헤더
interface TableHeaderProps extends React.ComponentPropsWithoutRef<"thead"> {
  className?: string
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className = "", children, ...props }, ref) => (
    <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props}>
      {children}
    </thead>
  ),
)
TableHeader.displayName = "TableHeader"

// 테이블 컨텐츠
interface TableBodyProps extends React.ComponentPropsWithoutRef<"tbody"> {
  className?: string
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className = "", children, ...props }, ref) => (
    <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
      {children}
    </tbody>
  ),
)
TableBody.displayName = "TableBody"

// 테이블 행
interface TableRowProps extends React.ComponentPropsWithoutRef<"tr"> {
  className?: string
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className = "", children, ...props }, ref) => (
    <tr
      ref={ref}
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
      {...props}
    >
      {children}
    </tr>
  ),
)
TableRow.displayName = "TableRow"

// 테이블 헤더 각 아이템
interface TableHeadProps extends React.ComponentPropsWithoutRef<"th"> {
  className?: string
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className = "", children, ...props }, ref) => (
    <th
      ref={ref}
      className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    >
      {children}
    </th>
  ),
)
TableHead.displayName = "TableHead"

// 테이블 행 각 아이템
interface TableCellProps extends React.ComponentPropsWithoutRef<"td"> {
  className?: string
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className = "", children, ...props }, ref) => (
    <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
    </td>
  ),
)
TableCell.displayName = "TableCell"
