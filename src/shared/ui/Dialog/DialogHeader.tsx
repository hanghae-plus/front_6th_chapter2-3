import { BaseProps } from '../../types/common';

interface DialogHeaderProps extends BaseProps {}

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);

DialogHeader.displayName = 'DialogHeader';
