import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} ref={ref} {...props} />
  ),
)

TableCell.displayName = "TableCell"
