import { Button, HighlightText, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui"
import type { Post } from "@/entities/posts"
import { postEntityQueries, usePostMutations } from "@/entities/posts"
import type { User } from "@/entities/users"
import { userEntityQueries } from "@/entities/users"
import { usePostListFilterQueryParams } from "@/widgets/post-list-table"

import { useQuery } from "@tanstack/react-query"
import { clsx } from "clsx"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useState } from "react"

type Props = {
  onOpenAuthorInformationDialog: (user: User) => void
  onOpenPostDetailDialog: (post: Post) => void
  onOpenUpdatePostDialog: (post: Post) => void
}

type CommentsMap = Record<number, { liked: boolean, disLiked: boolean }>

export const PostListTable = ({
  onOpenAuthorInformationDialog,
  onOpenPostDetailDialog,
  onOpenUpdatePostDialog,
}: Props) => {
  const postListFilter = usePostListFilterQueryParams()
  const { deletePost, likePost, dislikePost, undoLikePost, undoDislikePost } = usePostMutations({
    queryParams : { ... postListFilter.queryParams, slug: postListFilter.queryParams.selectedTag },
  })
  const [commentsMap, setCommentsMap] = useState<CommentsMap>({})

  const postsQuery = useQuery({
    ...postEntityQueries.getPosts({ ...postListFilter.queryParams }),
  })

  const postsByTagQuery = useQuery({
    ...postEntityQueries.getPostsBySlug({
      ...postListFilter.queryParams,
      slug: postListFilter.queryParams.selectedTag,
    }),
    enabled: !!postListFilter.queryParams.selectedTag,
  })

  const usersQuery = useQuery({
    ...userEntityQueries.getUsers({ limit: 0, select: "username,image" }),
    enabled: postsQuery.isFetched,
    select: (response) => ({
      data: response.users,
      pagination: { limit: response?.limit ?? 0, skip: response?.skip ?? 0, total: response?.total ?? 0 },
    }),
  })

  const posts = postListFilter.queryParams.selectedTag ? postsByTagQuery.data : postsQuery.data

  const postWithAuthors = posts?.posts.map((post) => ({
    ...post,
    author: usersQuery.data?.data.find((user) => user.id === post.userId),
  }))

  const handleClickPostLikeButton = (postID: number) => {
    const current = commentsMap[postID] ?? { liked: false, disLiked: false }

    if (current.liked) {
      setCommentsMap((prev) => ({ ...prev, [postID]: { liked: false, disLiked: false } }))
      undoLikePost.mutate({ id: postID })
      return
    }

    setCommentsMap((prev) => ({ ...prev, [postID]: { liked: true, disLiked: false } }))
    if (current.disLiked) {
      undoDislikePost.mutate({ id: postID })
    }
    likePost.mutate({ id: postID })
  }

  const handleClickPostDislikeButton = (postID: number) => {
    const current = commentsMap[postID] ?? { liked: false, disLiked: false }

    if (current.disLiked) {
      setCommentsMap((prev) => ({ ...prev, [postID]: { liked: false, disLiked: false } }))
      undoDislikePost.mutate({ id: postID })
      return
    }

    setCommentsMap((prev) => ({ ...prev, [postID]: { liked: false, disLiked: true } }))
    if (current.liked) {
      undoLikePost.mutate({ id: postID })
    }
    dislikePost.mutate({ id: postID })
  }

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
                  <HighlightText text={post.title} highlight={postListFilter.queryParams.searchQuery} />
                </div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={clsx("px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer", postListFilter.queryParams.selectedTag === tag
                        ? "text-white bg-blue-500 hover:bg-blue-600"
                        : "text-blue-800 bg-blue-100 hover:bg-blue-200")}
                      onClick={() => postListFilter.onTagChange(tag)}
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
                <button className="flex gap-1 items-center" onClick={() => handleClickPostLikeButton(post.id)}>
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.reactions?.likes || 0}</span>
                </button>
                <button className="flex gap-1 items-center" onClick={() => handleClickPostDislikeButton(post.id)}>
                  <ThumbsDown className="w-4 h-4" />
                  <span>{post.reactions?.dislikes || 0}</span>
                </button>
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
