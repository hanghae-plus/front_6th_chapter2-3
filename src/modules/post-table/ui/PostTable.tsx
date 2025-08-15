import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"

import { mergeClasses } from "@/base/lib"
import { Button } from "@/base/ui/Button"
import { Table } from "@/base/ui/Table"
import type { Post } from "@/entities/post/model"
import { PostHighlightText } from "@/entities/post/ui"
import type { User } from "@/entities/user/model"
import { UserAvatar } from "@/entities/user/ui"
import { usePostParamsStore } from "@/features/get-post/model"

type PostTableProps = {
  posts: (Post & { author?: User })[]
  onTagClick: (tag: string) => void
  onUserClick: (author: User) => void
  onPostDetailClick: (post: Post) => void
  onPostEditClick: (post: Post) => void
  onPostDeleteClick: (postId: number) => void
}

export function PostTable({
  posts,
  onTagClick,
  onUserClick,
  onPostDetailClick,
  onPostEditClick,
  onPostDeleteClick,
}: PostTableProps) {
  const search = usePostParamsStore((state) => state.search)
  const tag = usePostParamsStore((state) => state.tag)

  const handleTagClick = (postTag: string) => {
    onTagClick(postTag)
  }

  const handleUserClick = (author: User) => {
    onUserClick(author)
  }

  const handlePostDetailClick = (post: Post) => {
    onPostDetailClick(post)
  }

  const handlePostEditClick = (post: Post) => {
    onPostEditClick(post)
  }

  const handlePostDeleteClick = (postId: number) => {
    onPostDeleteClick(postId)
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[50px]">ID</Table.Head>
          <Table.Head>제목</Table.Head>
          <Table.Head className="w-[150px]">작성자</Table.Head>
          <Table.Head className="w-[150px]">반응</Table.Head>
          <Table.Head className="w-[150px]">작업</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {posts.map((post) => (
          <Table.Row key={post.id}>
            <Table.Cell>{post.id}</Table.Cell>
            <Table.Cell>
              <div className="space-y-1">
                <PostHighlightText text={post.title} highlight={search} />
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((postTag) => (
                    <span
                      key={postTag}
                      className={mergeClasses(
                        "cursor-pointer rounded-[4px] px-1 text-[9px] font-semibold",
                        tag === postTag
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200",
                      )}
                      onClick={() => handleTagClick(postTag)}
                    >
                      {postTag}
                    </span>
                  ))}
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>{post.author && <UserAvatar user={post.author} onUserClick={handleUserClick} />}</Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="h-4 w-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handlePostDetailClick(post)}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handlePostEditClick(post)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handlePostDeleteClick(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
