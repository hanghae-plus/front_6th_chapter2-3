import { ComponentPropsWithoutRef, ComponentRef, Ref } from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

// 기본 Select 컴포넌트들
export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

type SelectTriggerProps = {
  ref?: Ref<ComponentRef<typeof SelectPrimitive.Trigger>>
} & ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>

export const SelectTrigger = ({ className, children, ref, ...props }: SelectTriggerProps) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={`flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </SelectPrimitive.Trigger>
)

type SelectContentProps = {
  ref?: Ref<ComponentRef<typeof SelectPrimitive.Content>>
} & ComponentPropsWithoutRef<typeof SelectPrimitive.Content>

export const SelectContent = ({ className, children, position = "popper", ref, ...props }: SelectContentProps) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
)

type SelectItemProps = {
  ref?: Ref<ComponentRef<typeof SelectPrimitive.Item>>
} & ComponentPropsWithoutRef<typeof SelectPrimitive.Item>

export const SelectItem = ({ className, children, ref, ...props }: SelectItemProps) => (
  <SelectPrimitive.Item
    ref={ref}
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)
