import { PostTableRow } from "./PostTableRow.tsx"

import { Loading, Table, TableBody, TableHead, TableHeader, TableRow } from "@/shared/ui"
import { usePostTable } from "@/features/posts/model/usePostTable.ts"

export function PostsTable() {
  const { data, isLoading } = usePostTable()

  if (isLoading) return <Loading />
  if (!data) return <></>

  const { posts = [] } = data

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
          <PostTableRow key={post.id} post={post} />
        ))}
      </TableBody>
    </Table>
  )
}
