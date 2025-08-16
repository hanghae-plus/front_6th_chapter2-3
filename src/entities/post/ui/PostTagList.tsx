import type { ComponentPropsWithoutRef } from "react"

import { mergeClasses } from "@/base/lib"

import { PostTag } from "./PostTag"

type PostTagListProps = ComponentPropsWithoutRef<"div"> & {
  tags: string[]
}

export function PostTagList({ tags, className, ...rest }: PostTagListProps) {
  return (
    <div className={mergeClasses("flex flex-wrap gap-1", className)} {...rest}>
      {tags.map((tag) => (
        <PostTag key={tag} tag={tag} />
      ))}
    </div>
  )
}
