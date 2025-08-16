import { forwardRef } from "react"
import { TrProps } from "./type"

export const TableRow = forwardRef<HTMLTableRowElement, TrProps>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    {...props}
  />
))
TableRow.displayName = "TableRow"
