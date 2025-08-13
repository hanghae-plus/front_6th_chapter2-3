import type { ComponentPropsWithRef } from "react"

import { mergeClasses } from "@/shared/lib/styles"

type CardRootProps = ComponentPropsWithRef<"div">
type CardHeaderProps = ComponentPropsWithRef<"div">
type CardTitleProps = ComponentPropsWithRef<"h3">
type CardContentProps = ComponentPropsWithRef<"div">

function CardRoot({ className, ...rest }: CardRootProps) {
  return (
    <div className={mergeClasses("bg-card text-card-foreground rounded-lg border shadow-sm", className)} {...rest} />
  )
}

function CardHeader({ className, ...rest }: CardHeaderProps) {
  return <div className={mergeClasses("flex flex-col space-y-1.5 p-6", className)} {...rest} />
}

function CardTitle({ className, ...rest }: CardTitleProps) {
  return <h3 className={mergeClasses("text-2xl font-semibold leading-none tracking-tight", className)} {...rest} />
}

function CardContent({ className, ...rest }: CardContentProps) {
  return <div className={mergeClasses("p-6 pt-0", className)} {...rest} />
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Content: CardContent,
})
