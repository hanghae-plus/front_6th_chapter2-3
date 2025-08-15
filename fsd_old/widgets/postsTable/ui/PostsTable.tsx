import { usePostsSelector, usePostDetailStore } from "@entities/post"
import { useUserModalStore } from "@entities/user"
import { EditPostButton } from "@features/post"
import { DeletePostButton } from "@features/post/ui/DeletePostButton"
import { highlightText } from "@shared/lib/highlightText"
import { Button } from "@shared/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/ui/table"
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import { useSearchParams } from "react-router-dom"

export const PostsTable = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const skip = parseInt(searchParams.get("skip") || "0")
  const limit = parseInt(searchParams.get("limit") || "10")
  const sortBy = searchParams.get("sortBy") || ""
  const sortOrder = searchParams.get("sortOrder") || "asc"
  const selectedTag = searchParams.get("tag") || ""
  const { setSelectedPost, setIsOpenPostDetail } = usePostDetailStore((state) => state.actions)
  const { setSelectedUserId, setIsOpenUserModal } = useUserModalStore((state) => state.actions)

  const { posts, isLoading } = usePostsSelector({
    skip,
    limit,
    sortBy,
    sortOrder,
    searchQuery,
    selectedTag,
  })

  const handleTagChange = (tag: string) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)

      if (tag === "all") {
        updated.delete("tag")
      } else {
        updated.set("tag", tag)
      }

      return updated
    })
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
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
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        searchParams.get("tag") === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => handleTagChange(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => {
                  setSelectedUserId(post.author?.id || 0)
                  setIsOpenUserModal(true)
                }}
              >
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    setIsOpenPostDetail(true)
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <EditPostButton post={post} />
                <DeletePostButton postId={post.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
