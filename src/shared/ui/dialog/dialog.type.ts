import * as DialogPrimitive from "@radix-ui/react-dialog"
import { HTMLAttributes } from "react"
export interface DialogContentProps extends DialogPrimitive.DialogContentProps {
  ref?: React.Ref<HTMLDivElement>
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

export interface DialogTitleProps extends DialogPrimitive.DialogTitleProps {
  ref?: React.Ref<HTMLHeadingElement>
}
