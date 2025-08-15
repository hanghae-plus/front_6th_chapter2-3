import { forwardRef } from "react"

export const DialogHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} ref={ref} {...props} />
  ),
)

DialogHeader.displayName = "DialogHeader"
