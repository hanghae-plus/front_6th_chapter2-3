import * as SelectPrimitive from "@radix-ui/react-select"
import { SelectContent } from "../select-content"
import { SelectItem } from "../select-item"
import { SelectTrigger } from "../select-trigger"
import { Select as SelectContainer } from "../index"
import { SelectValue } from ".."

interface SelectProps {
  value?: string
  placeholder: string
  onValueChange?: (value: string) => void
  triggerProps?: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
  options: Array<{ value: string | number; name: string }>
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, placeholder, triggerProps, options }) => {
  return (
    <SelectContainer value={value} onValueChange={onValueChange}>
      <SelectTrigger {...triggerProps}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ name, value }) => {
          return (
            <SelectItem key={value} value={value.toString()}>
              {name}
            </SelectItem>
          )
        })}
      </SelectContent>
    </SelectContainer>
  )
}
