import * as DialogPrimitive from "@radix-ui/react-dialog"
import { forwardRef } from "react"

export const DialogTitle = forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      ref={ref}
      {...props}
    />
  ),
)

DialogTitle.displayName = DialogPrimitive.Title.displayName
