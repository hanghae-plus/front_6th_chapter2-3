import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

export const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead className={cn("[&_tr]:border-b", className)} ref={ref} {...props} />,
)

TableHeader.displayName = "TableHeader"
