import { Trigger } from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react";

export const SelectTrigger = ({ className, children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => (
  <Trigger
    className={`flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </Trigger>
);