import type { ComponentProps } from "react"

import { mergeClasses } from "../utils/classUtils"

type FooterProps = ComponentProps<"footer">

export function Footer({ className, ...rest }: FooterProps) {
  return (
    <footer className={mergeClasses("mt-8 bg-gray-100 py-4 text-gray-600", className)} {...rest}>
      <div className="container mx-auto text-center">
        <p>&copy; 2023 Post Management System. All rights reserved.</p>
      </div>
    </footer>
  )
}
