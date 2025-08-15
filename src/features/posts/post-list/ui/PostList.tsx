import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import {
  TableHeader,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Button,
  highlightText,
} from "../../../../shared/ui"
import { useSearchFilter } from "../../../../shared/store"
import { Post } from "../../../../entities/posts/api/types"
import { Users } from "../../../../entities/users/api/types"
import { usePostsQuery } from "../../model/queries"
import { usePostList } from "../model/usePostList"
import { useUserInfo } from "../../../user/user-info"
import { usePostDetail } from "../../post-detail"
import { useEditPost } from "../../edit-post"

export interface PostsWithUsers extends Post {
  author?: Users | undefined
}

interface PostListProps {
  updateURL: () => void
}

export const PostList = (props: PostListProps) => {
  const { data: postsData, isLoading, error } = usePostsQuery()
  const { filteredPostTag } = usePostList()
  const { selectedTag } = useSearchFilter()
  const { openUserModal } = useUserInfo()
  const { openPostDetail } = usePostDetail()
  const { deletePost, openEditDialog } = useEditPost()

  const { searchQuery } = useSearchFilter()

  if (isLoading) return <div className="flex justify-center p-4">로딩 중...</div>
  if (error) return <div className="flex justify-center p-4">오류가 발생했습니다.</div>
  if (!postsData?.posts) return <div className="flex justify-center p-4">게시물이 없습니다.</div>

  const posts = postsData.posts

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
        {posts.map((post: PostsWithUsers) => (
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
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => filteredPostTag(tag, props.updateURL)}
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
                  openUserModal(post.author.id)
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
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
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
