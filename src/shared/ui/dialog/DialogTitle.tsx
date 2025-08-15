import { Title } from "@radix-ui/react-dialog";

export const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <Title
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
);