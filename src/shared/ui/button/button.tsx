import { buttonVariants } from "./button.css"

import type { ButtonProps } from "./button.type"

export const Button = ({ className, variant, size, ref, ...props }: ButtonProps) => {
  return <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
}

Button.displayName = "Button"
