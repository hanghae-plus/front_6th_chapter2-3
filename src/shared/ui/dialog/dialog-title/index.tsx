import { forwardRef } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>, // ref 타입
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> // props 타입
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName
