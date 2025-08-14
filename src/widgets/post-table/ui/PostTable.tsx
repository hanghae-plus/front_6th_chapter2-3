import { usePosts } from "@/features/post/read-post/model"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/shared/ui"
import { PostTableRow } from "./PostTableRow"

interface PostTableProps {
  searchQuery: string
  selectedTag: string
  onTagSelect: (tag: string) => void
  onPostSelect: (postId: number) => void
}

export const PostTable = ({ searchQuery, selectedTag, onTagSelect, onPostSelect }: PostTableProps) => {
  const postsQuery = usePosts()

  const posts = postsQuery.posts || []

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <PostTableRow
            key={post.id}
            post={post}
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            onTagSelect={onTagSelect}
            onPostSelect={onPostSelect}
          />
        ))}
      </TableBody>
    </Table>
  )
}
