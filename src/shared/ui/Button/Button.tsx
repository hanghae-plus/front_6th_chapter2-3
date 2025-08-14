import { forwardRef } from 'react';
import { BaseProps } from '../../types/common';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from './buttonVariants';

interface ButtonProps extends BaseProps, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, disabled, onClick, className, variant, size, ...props }, ref) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
