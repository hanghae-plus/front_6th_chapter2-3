import { forwardRef } from "react"
import { HeadingProps } from "./type"

export const CardTitle = forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
))
CardTitle.displayName = "CardTitle"
