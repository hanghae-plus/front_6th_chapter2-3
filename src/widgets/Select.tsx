import * as SelectPrimitive from "@radix-ui/react-select"
import { SelectValue, Select as SelectContainer, SelectTrigger, SelectContent, SelectItem } from "../shared/ui"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  items: { label: string; value: string }[]
  triggerProps?: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
  placeholder: string
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, placeholder, triggerProps }) => {
  return (
    <SelectContainer value={value} onValueChange={onValueChange}>
      <SelectTrigger {...triggerProps}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">없음</SelectItem>
        <SelectItem value="id">ID</SelectItem>
        <SelectItem value="title">제목</SelectItem>
        <SelectItem value="reactions">반응</SelectItem>
      </SelectContent>
    </SelectContainer>
  )
}
