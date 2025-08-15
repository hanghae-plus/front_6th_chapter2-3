import { forwardRef, TextareaHTMLAttributes } from "react"
import { cva, VariantProps } from "class-variance-authority"

const textareaVariants = cva(
  "flex min-h-[150px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
)

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  className?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return <textarea className={textareaVariants({ className })} ref={ref} {...props} />
})

Textarea.displayName = "Textarea"
