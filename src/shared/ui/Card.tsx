import * as React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Card = ({ className, ref, ...props }: CardProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
)

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const CardHeader = ({ className, ref, ...props }: CardHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
)

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
}

export const CardTitle = ({ className, ref, ...props }: CardTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => (
  <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
)

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const CardContent = ({ className, ref, ...props }: CardContentProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
)
