import { buttonVariants } from './constant'
import { IButtonProps } from './type'

export const Button = ({ className, variant, size, ...props }: IButtonProps) => {
  return <button className={buttonVariants({ variant, size, className })} {...props} />
}
