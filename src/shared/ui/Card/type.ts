interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

interface ICardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

interface ICardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  ref?: React.Ref<HTMLHeadingElement>
}

interface ICardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export type { ICardProps, ICardHeaderProps, ICardTitleProps, ICardContentProps }
