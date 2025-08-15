import {
  Content,
  Item,
  ItemIndicator,
  ItemText,
  Portal,
  Root,
  Trigger,
  Value,
  Viewport,
} from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

export const Select = Root;
export const SelectValue = Value;

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export const SelectTrigger = ({
  className,
  children,
  ...props
}: SelectTriggerProps) => (
  <Trigger
    className={`flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </Trigger>
);
SelectTrigger.displayName = Trigger.displayName;

interface SelectOptionsProps<T extends string> {
  options: {
    value: T;
    name: string;
  }[];
}

export const SelectOptions = <T extends string>({
  options,
}: SelectOptionsProps<T>) => {
  return (
    <SelectContent>
      {options.map(({ value, name }) => (
        <SelectItem key={value} value={value}>
          {name}
        </SelectItem>
      ))}
    </SelectContent>
  );
};

interface SelectContentProps {
  className?: string;
  children?: React.ReactNode;
  position?: 'popper' | 'item-aligned';
}

export const SelectContent = ({
  className,
  children,
  position = 'popper',
  ...props
}: SelectContentProps) => (
  <Portal>
    <Content
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
      position={position}
      {...props}
    >
      <Viewport className="p-1">{children}</Viewport>
    </Content>
  </Portal>
);
SelectContent.displayName = Content.displayName;

interface SelectItemProps {
  className?: string;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export const SelectItem = ({
  className,
  children,
  value,
  disabled,
  ...props
}: SelectItemProps) => (
  <Item
    value={value}
    disabled={disabled}
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <Check className="h-4 w-4" />
      </ItemIndicator>
    </span>
    <ItemText>{children}</ItemText>
  </Item>
);
SelectItem.displayName = Item.displayName;
