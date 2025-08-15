import * as React from "react"
import { forwardRef } from "react"

// 카드 컴포넌트
type DivProps = React.HTMLAttributes<HTMLDivElement> & { className?: string }
export const Card = forwardRef<HTMLDivElement, DivProps>(({ className = "", ...props }, ref) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} ref={ref} {...props} />
))
Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, DivProps>(({ className = "", ...props }, ref) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} ref={ref} {...props} />
))
CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { className?: string }
>(({ className = "", ...props }, ref) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} ref={ref} {...props} />
))
CardTitle.displayName = "CardTitle"

export const CardContent = forwardRef<HTMLDivElement, DivProps>(({ className = "", ...props }, ref) => (
  <div className={`p-6 pt-0 ${className}`} ref={ref} {...props} />
))
CardContent.displayName = "CardContent"
