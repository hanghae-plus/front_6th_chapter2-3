import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from './buttonVariants';

interface ButtonProps extends BaseProps, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />;
  },
);

Button.displayName = 'Button';
