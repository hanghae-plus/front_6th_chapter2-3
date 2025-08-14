interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
}

interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string
}

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string
}

// 테이블 컴포넌트
export function Table({ className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className={`table-fixed w-full caption-bottom text-sm ${className || ""}`} {...props} />
    </div>
  )
}

// 테이블 헤더 컴포넌트
export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead className={`[&_tr]:border-b ${className || ""}`} {...props} />
}

// 테이블 바디 컴포넌트
export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className || ""}`} {...props} />
}

// 테이블 행 컴포넌트
export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className || ""}`}
      {...props}
    />
  )
}

// 테이블 헤드 컴포넌트
export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className || ""}`}
      {...props}
    />
  )
}

// 테이블 셀 컴포넌트
export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className || ""}`} {...props} />
}
