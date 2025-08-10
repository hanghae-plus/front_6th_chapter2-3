import { HTMLAttributes } from "react"

export interface TextareaProps extends HTMLAttributes<HTMLTextAreaElement> {
  ref?: React.Ref<HTMLTextAreaElement>
}
