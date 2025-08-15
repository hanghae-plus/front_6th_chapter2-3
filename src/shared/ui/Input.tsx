import { cva, VariantProps } from "class-variance-authority"
import { forwardRef, HTMLInputTypeAttribute, InputHTMLAttributes } from "react"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
)

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  type?: HTMLInputTypeAttribute
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={inputVariants({
        className,
      })}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"
