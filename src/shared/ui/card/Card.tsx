import { HTMLAttributes, Ref } from "react"

type CardProps = {
  ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const Card = ({ ref, className, ...props }: CardProps) => (
  <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
)

type CardHeaderProps = {
  ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const CardHeader = ({ ref, className, ...props }: CardHeaderProps) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
)

type CardTitleProps = {
  ref?: Ref<HTMLHeadingElement>
} & HTMLAttributes<HTMLHeadingElement>

export const CardTitle = ({ ref, className, ...props }: CardTitleProps) => (
  <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
)

type CardContentProps = {
  ref?: Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const CardContent = ({ ref, className, ...props }: CardContentProps) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
)
