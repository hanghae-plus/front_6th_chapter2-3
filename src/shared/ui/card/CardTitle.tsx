import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} ref={ref} {...props} />
  ),
)

CardTitle.displayName = "CardTitle"
