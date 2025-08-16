import { forwardRef } from "react"
import { ButtonProps } from "./type"
import { buttonVariants } from "./class"

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
})

Button.displayName = "Button"
