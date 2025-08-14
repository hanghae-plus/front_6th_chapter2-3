/* eslint-disable @typescript-eslint/no-explicit-any */

import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"

import { PostHighlightText } from "@/entities/post/ui"
import { usePostParamsStore } from "@/features/get-post/model"
import { mergeClasses } from "@/shared/lib"
import { Button } from "@/shared/ui/Button"
import { Table } from "@/shared/ui/Table"

type PostTableProps = {
  posts: any[]
  onTagClick: (tag: string) => void
  onUserClick: (author: any) => void
  onPostDetailClick: (post: any) => void
  onPostEditClick: (post: any) => void
  onPostDeleteClick: (postId: any) => void
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

  const handleUserClick = (author: any) => {
    onUserClick(author)
  }

  const handlePostDetailClick = (post: any) => {
    onPostDetailClick(post)
  }

  const handlePostEditClick = (post: any) => {
    onPostEditClick(post)
  }

  const handlePostDeleteClick = (postId: any) => {
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
        {posts.map((post: any) => (
          <Table.Row key={post.id}>
            <Table.Cell>{post.id}</Table.Cell>
            <Table.Cell>
              <div className="space-y-1">
                <PostHighlightText text={post.title} highlight={search} />
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((postTag: any) => (
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
            <Table.Cell>
              <div className="flex cursor-pointer items-center space-x-2" onClick={() => handleUserClick(post.author)}>
                <img src={post.author?.image} alt={post.author?.username} className="h-8 w-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </Table.Cell>
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
