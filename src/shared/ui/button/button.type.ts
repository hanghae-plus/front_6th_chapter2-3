import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "./button.css"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  ref: React.Ref<HTMLButtonElement>
}
