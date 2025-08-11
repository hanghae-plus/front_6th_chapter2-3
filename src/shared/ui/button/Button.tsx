import * as React from "react"
import { forwardRef } from "react"
import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/shared/ui/button/button-variants"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  className?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
})

Button.displayName = "Button"

export type { ButtonProps }
