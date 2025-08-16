interface TagItemProps {
  tag: string
  isSelected?: boolean
  onClick?: (tag: string) => void
  size?: "sm" | "md" | "lg"
  variant?: "default" | "selected" | "clickable"
}

export const TagItem = ({ tag, isSelected = false, onClick, size = "sm", variant = "default" }: TagItemProps) => {
  const sizeClasses = {
    sm: "px-1 text-[9px]",
    md: "px-2 text-xs",
    lg: "px-3 text-sm",
  }

  const variantClasses = {
    default: "text-blue-800 bg-blue-100",
    selected: "text-white bg-blue-500 hover:bg-blue-600",
    clickable: "text-blue-800 bg-blue-100 hover:bg-blue-200 cursor-pointer",
  }

  const baseClasses = "font-semibold rounded-[4px] transition-colors"
  const sizeClass = sizeClasses[size]
  const variantClass = isSelected ? variantClasses.selected : variantClasses[variant]

  const handleClick = () => {
    if (onClick) {
      onClick(tag)
    }
  }

  return (
    <span className={`${baseClasses} ${sizeClass} ${variantClass}`} onClick={handleClick}>
      {tag}
    </span>
  )
}
