// src/shared/ui/table/table.tsx
import React, { forwardRef } from "react"

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string
}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className || ""}`} {...props} />
  </div>
))

Table.displayName = "Table"
