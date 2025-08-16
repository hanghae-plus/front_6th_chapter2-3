import { PostsInputSearch } from "@/features/posts/ui/PostsInputSearch.tsx"
import { PostsSelectorSort } from "@/features/posts/ui/PostsSelectorSort.tsx"
import { PostsSelectorSortOrder } from "@/features/posts/ui/PostsSelectorSortOrder.tsx"
import { PostsSelectorTag } from "@/features/posts/ui/PostsSelectorTag.tsx"

export function PostsTableHeader() {
  return (
    <div className="flex gap-4">
      <PostsInputSearch />
      <PostsSelectorTag />
      <PostsSelectorSort />
      <PostsSelectorSortOrder />
    </div>
  )
}
