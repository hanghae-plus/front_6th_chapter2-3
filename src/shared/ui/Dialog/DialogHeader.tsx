import { BasePropsWithChildren } from '../../types/common';

export const DialogHeader = ({ children, className, ...props }: BasePropsWithChildren) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
    {children}
  </div>
);

DialogHeader.displayName = 'DialogHeader';
