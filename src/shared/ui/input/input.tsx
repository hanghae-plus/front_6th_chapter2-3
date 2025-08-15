import { inputVariants } from "./input.css"

import type { VariantProps } from "class-variance-authority"

interface Props extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  ref?: React.Ref<HTMLInputElement>
}

export const Input = ({ className, type, ref, ...props }: Props) => {
  return <input type={type} className={inputVariants({ className })} ref={ref} {...props} />
}
Input.displayName = "Input"
