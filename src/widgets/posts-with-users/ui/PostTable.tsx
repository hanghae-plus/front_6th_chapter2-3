import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"

import { useDeletePostMutation } from "@/feature/delete-post"
import { UserProfileButton } from "@/feature/get-users-summary/ui/UserProfileButton"
import { usePostsQuery } from "@/feature/post-query/model/usePostsQuery"
import { UpdatePostButton } from "@/feature/update-post"
import { highlightText } from "@/shared"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui"
import { PostDetailButton } from "@/widgets/post-detail-modal"

import { usePostsWithUserSummaryQuery } from "../api/queries"

export const PostsTable = () => {
  const { current, updateQuery } = usePostsQuery()
  const { mutate: deletePostMutate } = useDeletePostMutation()
  const { data: postsWithUsers, isLoading } = usePostsWithUserSummaryQuery()

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
        {postsWithUsers?.posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, current.search)}</div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag: string) => (
                    <span
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        current.tag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      key={tag}
                      onClick={() => updateQuery({ tag })}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>{post.author && <UserProfileButton user={post.author} />}</TableCell>
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
                <PostDetailButton post={post} />
                <UpdatePostButton post={post} />
                <Button aria-label="게시물 삭제" onClick={() => deletePostMutate(post.id)} size="sm" variant="ghost">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
