import * as React from 'react'

// ============================================
// 타입 정의
// ============================================
type TableProps = React.ComponentProps<'table'>
type TableHeaderProps = React.ComponentProps<'thead'>
type TableBodyProps = React.ComponentProps<'tbody'>
type TableRowProps = React.ComponentProps<'tr'>
type TableHeadProps = React.ComponentProps<'th'>
type TableCellProps = React.ComponentProps<'td'>
type TableRootProps = React.ComponentProps<'div'>

const TableRoot = ({ className, ref, children, ...props }: TableRootProps) => (
  <div
    ref={ref}
    className={`w-full overflow-auto ${className || ''}`}
    {...props}
  >
    {children}
  </div>
)

const TableElement = ({ className, ref, ...props }: TableProps) => (
  <table
    ref={ref}
    className={`table-fixed w-full caption-bottom text-sm ${className || ''}`}
    {...props}
  />
)

const TableHeader = ({ className, ref, ...props }: TableHeaderProps) => (
  <thead
    ref={ref}
    className={`[&_tr]:border-b ${className || ''}`}
    {...props}
  />
)

const TableBody = ({ className, ref, ...props }: TableBodyProps) => (
  <tbody
    ref={ref}
    className={`[&_tr:last-child]:border-0 ${className || ''}`}
    {...props}
  />
)

const TableRow = ({ className, ref, ...props }: TableRowProps) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className || ''}`}
    {...props}
  />
)

const TableHead = ({ className, ref, ...props }: TableHeadProps) => (
  <th
    ref={ref}
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className || ''}`}
    {...props}
  />
)

const TableCell = ({ className, ref, ...props }: TableCellProps) => (
  <td
    ref={ref}
    className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`}
    {...props}
  />
)

// ============================================
// 컴파운드 패턴 구성
// ============================================
export const Table = Object.assign(TableRoot, {
  Table: TableElement,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
})

// 개별 export도 제공 (하위 호환성)
export {
  TableElement,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
}
