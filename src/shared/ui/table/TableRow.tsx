import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
      ref={ref}
      {...props}
    />
  ),
)

TableRow.displayName = "TableRow"
