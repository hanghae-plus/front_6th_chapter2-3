import { PropsWithChildren } from "react"

export const TagItem = ({
  children,
  isActive = false,
  onClick,
}: PropsWithChildren<{ isActive: boolean; onClick: VoidFunction }>) => {
  return (
    <span
      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
        isActive ? "text-white bg-blue-500 hover:bg-blue-600" : "text-blue-800 bg-blue-100 hover:bg-blue-200"
      }`}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
