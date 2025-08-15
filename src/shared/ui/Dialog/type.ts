interface IDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

interface IDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

interface IDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  ref?: React.Ref<HTMLHeadingElement>
}

export type { IDialogContentProps, IDialogHeaderProps, IDialogTitleProps }
