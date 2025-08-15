import { cva, VariantProps } from "class-variance-authority"
import { forwardRef, HTMLAttributes } from "react"

const cardVariants = cva("rounded-lg border bg-card text-card-foreground shadow-sm")

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  className?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cardVariants({ className })} {...props} />
))
Card.displayName = "Card"

const cardHeaderVariants = cva("flex flex-col space-y-1.5 p-6")

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardHeaderVariants> {
  className?: string
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cardHeaderVariants({ className })} {...props} />
))
CardHeader.displayName = "CardHeader"

const cardTitleVariants = cva("text-2xl font-semibold leading-none tracking-tight")

export interface CardTitleProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardTitleVariants> {
  className?: string
}

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cardTitleVariants({ className })} {...props} />
))
CardTitle.displayName = "CardTitle"

const cardContentVariants = cva("p-6 pt-0")

export interface CardContentProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardContentVariants> {
  className?: string
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cardContentVariants({ className })} {...props} />
))
CardContent.displayName = "CardContent"
