import { BaseProps } from '../../types/common';

interface DialogHeaderProps extends BaseProps {
  children: React.ReactNode;
}

export const DialogHeader = ({ children, className, ...props }: DialogHeaderProps) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);

DialogHeader.displayName = 'DialogHeader';
