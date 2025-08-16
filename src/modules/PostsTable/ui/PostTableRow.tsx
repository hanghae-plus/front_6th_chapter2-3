import { highlightText } from "@/shared/lib/highlightText.tsx"
import { PostButtonDelete } from "@/features/post/ui/PostButtonDelete.tsx"
import { PostButtonOpenDialogDetail } from "@/features/post/ui/PostButtonOpenDialogDetail.tsx"
import { PostButtonOpenDialogEdit } from "@/features/post/ui/PostButtonOpenDialogEdit.tsx"
import { TagChip } from "@/features/tag/ui/TagChip.tsx"
import { UserOpenDialogButton } from "@/features/user/ui/UserOpenDialogButton.tsx"

import { TableCell, TableRow } from "@/shared/ui"
import { Post } from "@/entities/Post"
import { usePostRouteParams } from "@/features/posts/model/usePostRouteParams.ts"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { Key } from "react"

export function PostTableRow({ post }: { key: Key; post: Post }) {
  const { searchQuery } = usePostRouteParams()

  return (
    <TableRow key={post.id}>
      <TableCell>{post.id}</TableCell>

      <TableCell>
        <div className="space-y-1">
          <div>{highlightText(post.title, searchQuery)}</div>
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <UserOpenDialogButton user={post.author} />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.reactions?.likes || 0}</span>

          <ThumbsDown className="w-4 h-4" />
          <span>{post.reactions?.dislikes || 0}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <PostButtonOpenDialogDetail post={post} />
          <PostButtonOpenDialogEdit post={post} />
          <PostButtonDelete post={post} />
        </div>
      </TableCell>
    </TableRow>
  )
}
