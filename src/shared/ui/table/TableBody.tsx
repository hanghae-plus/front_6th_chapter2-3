import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} ref={ref} {...props} />
  ),
)

TableBody.displayName = "TableBody"
