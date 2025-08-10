import { HTMLAttributes } from "react"

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  ref?: React.Ref<HTMLTableElement>
}

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  ref?: React.Ref<HTMLTableSectionElement>
}
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  ref?: React.Ref<HTMLTableSectionElement>
}
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  ref?: React.Ref<HTMLTableRowElement>
}
export interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  ref?: React.Ref<HTMLTableCellElement>
}
export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  ref?: React.Ref<HTMLTableCellElement>
}
