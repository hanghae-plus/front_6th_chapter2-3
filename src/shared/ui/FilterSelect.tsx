import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./index"

interface FilterSelectProps {
  value: string | undefined
  onValueChange: (value: string) => void
  placeholder: string
  options: { value: string; label: string }[]
  className?: string
}

export const FilterSelect = ({
  value,
  onValueChange,
  placeholder,
  options,
  className = "w-[180px]",
}: FilterSelectProps) => {
  // value가 undefined나 null일 때 빈 문자열로 처리하여 제어된 상태 유지
  // 빈 문자열도 유효한 값으로 처리
  const controlledValue = value ?? ""

  return (
    <Select value={controlledValue} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
