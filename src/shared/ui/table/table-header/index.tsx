import { forwardRef } from "react"
import { TableHeadearProps } from "./type"

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeadearProps>(({ className, ...props }, ref) => (
  <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
))

TableHeader.displayName = "TableHeader"
