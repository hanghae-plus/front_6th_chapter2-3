import { forwardRef } from "react"
import { TdProps } from "./type"

export const TableCell = forwardRef<HTMLTableCellElement, TdProps>(({ className, ...props }, ref) => (
  <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
))
TableCell.displayName = "TableCell"
