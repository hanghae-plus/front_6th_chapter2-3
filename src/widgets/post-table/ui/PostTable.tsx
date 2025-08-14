import { useSearchParams } from "react-router-dom"
import { usePosts, useSelectedPostStore } from "@/features/post/read-post/model"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/shared/ui"
import { PostTableRow } from "./PostTableRow"

export const PostTable = () => {
  const [searchParams, setSearchParams] = useSearchParams("")

  const searchQuery = searchParams.get("search") || ""
  const selectedTag = searchParams.get("tag") || ""
  const postsQuery = usePosts()
  const posts = postsQuery.posts || []

  const { setSelectedPostId } = useSelectedPostStore()

  const handlePostSelect = (postId: number) => {
    setSelectedPostId(postId)
  }

  const handleTagChange = (tag: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("tag", tag)
      return newParams
    })
  }

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
            onTagSelect={handleTagChange}
            onPostSelect={handlePostSelect}
          />
        ))}
      </TableBody>
    </Table>
  )
}
