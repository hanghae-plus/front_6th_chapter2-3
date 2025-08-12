import { forwardRef } from "react"

// 테이블 컴포넌트
export const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
    </div>
  ),
)
Table.displayName = "Table"

// 테이블 헤더 컴포넌트
export const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />,
)
TableHeader.displayName = "TableHeader"

// 테이블 바디 컴포넌트
export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
  ),
)
TableBody.displayName = "TableBody"

// 테이블 행 컴포넌트
export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
      {...props}
    />
  ),
)
TableRow.displayName = "TableRow"

// 테이블 헤드 컴포넌트
export const TableHead = forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  ),
)
TableHead.displayName = "TableHead"

// 테이블 셀 컴포넌트
export const TableCell = forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
  ),
)
TableCell.displayName = "TableCell"
