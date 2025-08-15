import * as SelectPrimitive from '@radix-ui/react-select'

interface ISelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children?: React.ReactNode
  ref?: React.Ref<HTMLButtonElement>
}

interface ISelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  position?: SelectPrimitive.SelectContentProps['position']
  ref?: React.Ref<HTMLDivElement>
}

interface ISelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  value: string
  ref?: React.Ref<HTMLDivElement>
}

export type { ISelectTriggerProps, ISelectContentProps, ISelectItemProps }
