import { ThumbsDown, ThumbsUp } from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

import { mergeClasses } from "@/base/lib"

type Reactions = {
  likes: number
  dislikes: number
}

type PostReactionsProps = ComponentPropsWithoutRef<"div"> & {
  reactions?: Reactions
}

export function PostReactions({ reactions, className, ...rest }: PostReactionsProps) {
  const likes = reactions?.likes || 0
  const dislikes = reactions?.dislikes || 0

  return (
    <div className={mergeClasses("flex items-center gap-2", className)} {...rest}>
      <ThumbsUp className="h-4 w-4" />
      <span>{likes}</span>
      <ThumbsDown className="h-4 w-4" />
      <span>{dislikes}</span>
    </div>
  )
}
