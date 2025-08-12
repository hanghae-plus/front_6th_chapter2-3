import { useQueryParamsPagination } from "@/shared/hooks"
import { Button, HighlightText, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui"
import type { Post } from "@/entities/posts"
import { deletePost as deletePostAction, postEntityQueries } from "@/entities/posts"
import type { User } from "@/entities/users"
import { userEntityQueries } from "@/entities/users"

import { useMutation, useQuery } from "@tanstack/react-query"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"

type Props = {
  onOpenAuthorInformationDialog: (user: User) => void
  onOpenPostDetailDialog: (post: Post) => void
  onOpenUpdatePostDialog: (post: Post) => void
}

export const PostListTable = ({
  onOpenAuthorInformationDialog,
  onOpenPostDetailDialog,
  onOpenUpdatePostDialog,
}: Props) => {
  const [selectedTag, setSelectedTag] = useQueryState("tag", parseAsString.withDefault(""))
  const [pagination] = useQueryParamsPagination()
  const postsQuery = useQuery({
    ...postEntityQueries.getPosts({ limit: pagination.limit, skip: pagination.skip }),
  })

  const usersQuery = useQuery({
    ...userEntityQueries.getUsers({ limit: 0, select: "username,image" }),
    enabled: postsQuery.isFetched,
    select: (response) => ({
      data: response.users,
      pagination: { limit: response?.limit ?? 0, skip: response?.skip ?? 0, total: response?.total ?? 0 },
    }),
  })

  const postWithAuthors = postsQuery.data?.posts.map((post) => ({
    ...post,
    author: usersQuery.data?.data.find((user) => user.id === post.userId),
  }))

  const deletePost = useMutation({
    mutationFn: deletePostAction,
    onError: (error) => console.error("게시물 삭제 오류:", error),
  })

  

  if (postsQuery.isLoading || usersQuery.isLoading) {
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
        {postWithAuthors?.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>
                  <HighlightText text={post.title} highlight={pagination.searchQuery} />
                </div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSelectedTag(tag)
                      }}
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
                  if (!post.author) return
                  onOpenAuthorInformationDialog(post.author)
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
                <Button variant="ghost" size="sm" onClick={() => onOpenPostDetailDialog(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onOpenUpdatePostDialog(post)
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deletePost.mutate({ id: post.id })}>
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
