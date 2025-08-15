import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn("p-6 pt-0", className)} ref={ref} {...props} />,
)

CardContent.displayName = "CardContent"
