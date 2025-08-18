interface ITableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string
  ref?: React.Ref<HTMLTableElement>
}

interface ITableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
  ref?: React.Ref<HTMLTableSectionElement>
}

interface ITableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
  ref?: React.Ref<HTMLTableSectionElement>
}
interface ITableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
  ref?: React.Ref<HTMLTableRowElement>
}

interface ITableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string
  ref?: React.Ref<HTMLTableCellElement>
}

interface ITableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string
  ref?: React.Ref<HTMLTableCellElement>
}

export type { ITableProps, ITableHeaderProps, ITableBodyProps, ITableRowProps, ITableHeadProps, ITableCellProps }
