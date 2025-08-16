import type { ComponentPropsWithoutRef } from "react"

import { mergeClasses } from "@/base/lib"
import { usePostParamsStore } from "@/features/get-post/model"

type PostTagProps = ComponentPropsWithoutRef<"span"> & {
  tag: string
}

export function PostTag({ tag, className, ...props }: PostTagProps) {
  const { updateParam } = usePostParamsStore((state) => state.actions)
  const activeTag = usePostParamsStore((state) => state.tag)

  const isActive = activeTag === tag

  const handleClick = () => {
    updateParam("tag", tag)
  }

  return (
    <span
      className={mergeClasses(
        "cursor-pointer rounded-[4px] px-1 text-[9px] font-semibold",
        isActive ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-100 text-blue-800 hover:bg-blue-200",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {tag}
    </span>
  )
}
