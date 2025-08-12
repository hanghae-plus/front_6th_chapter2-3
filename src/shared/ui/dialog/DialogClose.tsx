import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { forwardRef } from "react"

interface DialogCloseProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {
  className?: string
}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    className={`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground ${className}`}
    ref={ref}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">닫기</span>
  </DialogPrimitive.Close>
))

DialogClose.displayName = DialogPrimitive.Close.displayName
