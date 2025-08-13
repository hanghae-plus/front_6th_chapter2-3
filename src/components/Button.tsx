import { cva, VariantProps } from "class-variance-authority"
import type { ComponentPropsWithRef } from "react"

import { mergeClasses } from "../utils/classUtils"

const buttonVariants = cva(
  "focus-visible:ring-ring ring-offset-background inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-600",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
        link: "text-blue-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

type ButtonProps = VariantProps<typeof buttonVariants> & ComponentPropsWithRef<"button">

export function Button({ className, variant, size, ...rest }: ButtonProps) {
  return <button className={mergeClasses(buttonVariants({ variant, size }), className)} {...rest} />
}
