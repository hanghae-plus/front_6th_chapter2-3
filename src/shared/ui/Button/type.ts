import { VariantProps } from 'class-variance-authority'
import { buttonVariants } from './constant'

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  className?: string
}

export type { IButtonProps }
