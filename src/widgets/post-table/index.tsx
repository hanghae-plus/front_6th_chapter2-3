import React, { useMemo } from "react"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "@shared/ui"
import { highlightText } from "@shared/lib"
import { useDeletePost, useGetPosts, useGetPostsByTag, useGetPostSearch } from "@entities/post"
import type { Post } from "@entities/post"
import { Pagination } from "../pagination"
import { useGetUsers } from "@/entities/user"
import { usePostQueryParams } from "@/shared/hooks/use-post-query-params"

interface PostTableProps {
  searchQuery: string
  onTagSelect: (tag: string) => void
  onOpenDetail: (post: Post) => void
  onOpenUser: (userId: number) => void
  onEdit: (post: Post) => void
  onPrev: () => void
  onNext: () => void
  onLimitChange: (value: number) => void
  limitOptions?: number[]
}

export const PostTable: React.FC<PostTableProps> = ({
  searchQuery,
  onTagSelect,
  onOpenDetail,
  onOpenUser,
  onEdit,
  onPrev,
  onNext,
  onLimitChange,
}) => {
  const { param } = usePostQueryParams()

  // TanStack Query로 모든 데이터 조회
  const { data: postsData, isLoading: isLoadingPosts } = useGetPosts(
    param.limit,
    param.skip,
    param.sortBy,
    param.sortOrder,
  )
  const { data: searchData, isLoading: isLoadingSearch } = useGetPostSearch(
    searchQuery,
    param.limit,
    param.skip,
    param.sortBy,
    param.sortOrder,
  )
  const { data: tagData, isLoading: isLoadingTag } = useGetPostsByTag(
    param.tag,
    param.limit,
    param.skip,
    param.sortBy,
    param.sortOrder,
  )
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers("limit=0&select=username,image")
  const deletePostMutation = useDeletePost()

  // 조건에 따라 사용할 데이터 선택
  const currentPostsData = searchQuery ? searchData : param.tag && param.tag !== "all" ? tagData : postsData

  // 게시물에 작성자 정보 병합
  const posts = useMemo(() => {
    const base = currentPostsData?.posts || []
    return base.map((post) => ({
      ...post,
      author: usersData?.users?.find((user) => user.id === post.userId),
    }))
  }, [currentPostsData?.posts, usersData?.users])

  const handleDelete = (postId: number) => {
    deletePostMutation.mutate(postId, {
      onError: (error) => console.error("게시물 삭제 오류:", error),
    })
  }

  return (
    <>
      {isLoadingPosts || isLoadingSearch || isLoadingTag || isLoadingUsers ? (
        <div className="flex justify-center p-4">로딩 중...</div>
      ) : (
        <div className="space-y-4">
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
                              param.tag === tag
                                ? "text-white bg-blue-500 hover:bg-blue-600"
                                : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                            }`}
                            onClick={() => onTagSelect(tag)}
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
                      onClick={() => post.author && onOpenUser(post.author.id)}
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
                      <Button variant="ghost" size="sm" onClick={() => onOpenDetail(post)}>
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(post)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            total={currentPostsData?.total || 0}
            onPrev={onPrev}
            onNext={onNext}
            onLimitChange={onLimitChange}
          />
        </div>
      )}
    </>
  )
}
