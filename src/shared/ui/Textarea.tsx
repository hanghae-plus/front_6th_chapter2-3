import type { ComponentPropsWithRef } from "react"

import { mergeClasses } from "@/shared/lib/styles"

type TextareaProps = ComponentPropsWithRef<"textarea">

export function Textarea({ className, ...rest }: TextareaProps) {
  return (
    <textarea
      className={mergeClasses(
        "border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[150px] w-full rounded-md border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...rest}
    />
  )
}
