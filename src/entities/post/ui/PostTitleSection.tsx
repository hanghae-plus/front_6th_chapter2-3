import type { ComponentPropsWithoutRef } from "react"

import { mergeClasses } from "@/base/lib"
import { PostHighlightText } from "@/entities/post/ui"
import { PostTagList } from "@/entities/post/ui/PostTagList"
import { usePostParamsStore } from "@/features/get-post/model"

type PostTitleSectionProps = ComponentPropsWithoutRef<"div"> & {
  title: string
  tags?: string[]
}

export function PostTitleSection({ title, tags, className, ...props }: PostTitleSectionProps) {
  const searchInput = usePostParamsStore((state) => state.searchInput)

  return (
    <div className={mergeClasses("space-y-1", className)} {...props}>
      <PostHighlightText text={title} highlight={searchInput} />
      {tags && <PostTagList tags={tags} />}
    </div>
  )
}
