import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import type { ComponentPropsWithRef } from "react"

import { mergeClasses } from "../utils/classUtils"

const SelectRoot = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

type SelectTriggerProps = ComponentPropsWithRef<typeof SelectPrimitive.Trigger>
type SelectContentProps = ComponentPropsWithRef<typeof SelectPrimitive.Content> & {
  position?: "popper" | "item-aligned"
}
type SelectItemProps = ComponentPropsWithRef<typeof SelectPrimitive.Item>

function SelectTrigger({ className, children, ...rest }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={mergeClasses(
        "border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 items-center justify-between rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...rest}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({ className, children, position = "popper", ...rest }: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={mergeClasses(
          "text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md",
          className,
        )}
        position={position}
        {...rest}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ className, children, ...rest }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={mergeClasses(
        "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...rest}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export const Select = Object.assign(SelectRoot, {
  Group: SelectGroup,
  Value: SelectValue,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
})
