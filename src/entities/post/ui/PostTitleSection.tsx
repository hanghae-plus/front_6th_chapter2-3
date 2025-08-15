import type { ComponentPropsWithoutRef } from "react"

import { mergeClasses } from "@/base/lib"
import { usePostParamsStore } from "@/features/get-post/model"

import { PostHighlightText } from "./PostHighlightText"
import { PostTagList } from "./PostTagList"

type PostTitleSectionProps = ComponentPropsWithoutRef<"div"> & {
  title: string
  tags?: string[]
}

export function PostTitleSection({ title, tags, className, ...props }: PostTitleSectionProps) {
  const search = usePostParamsStore((state) => state.search)

  return (
    <div className={mergeClasses("space-y-1", className)} {...props}>
      <PostHighlightText text={title} highlight={search} />
      {tags && <PostTagList tags={tags} />}
    </div>
  )
}
