import type { ICardContentProps, ICardHeaderProps, ICardProps, ICardTitleProps } from './type'

export const Card = ({ className, ref, ...props }: ICardProps) => {
  return (
    <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
  )
}

export const CardHeader = ({ className, ref, ...props }: ICardHeaderProps) => {
  return <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
}

export const CardTitle = ({ className, ref, ...props }: ICardTitleProps) => {
  return <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
}

export const CardContent = ({ className, ref, ...props }: ICardContentProps) => {
  return <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
}
