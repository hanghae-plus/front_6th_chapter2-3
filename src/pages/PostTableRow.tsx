import type { Post } from "../entities/Post/Post.ts"
import { usePosts } from "../hooks/usePosts.tsx"
import { useComments } from "../hooks/useComments.tsx"
import { useApp } from "../hooks/useApp.tsx"
import { useQueryParams } from "../hooks/useQueryParams.ts"
import { useUser } from "../hooks/useUser.tsx"
import type { User } from "../entities/User/User.ts"
import { Button, TableCell, TableRow } from "../components"
import { highlightText } from "./highlightText.tsx"
import { TagView } from "./TagView.tsx"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"

export function PostTableRow({ post }: { post: Post }) {
  const { posts, setPosts } = usePosts()
  const { comments, setComments } = useComments()
  const { setShowPostDetailDialog, setShowUserModal, setSelectedPost, setShowEditDialog } = useApp()
  const { searchQuery } = useQueryParams()
  const { setSelectedUser } = useUser()

  // 댓글 가져오기
  async function handleCommentsFetch(post: Post) {
    if (comments[post.id]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${post.id}`)
      const data = await response.json()
      setComments((prev) => ({ ...prev, [post.id]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 게시물 상세 보기
  function handleOpenPostDetail(post: Post) {
    setSelectedPost(post)
    handleCommentsFetch(post)
    setShowPostDetailDialog(true)
  }

  // 게시물 삭제
  async function handlePostDelete(post: Post) {
    try {
      await fetch(`/api/posts/${post.id}`, { method: "DELETE" })
      setPosts(posts.filter((p) => p.id !== post.id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  function handleOpenEditDialog() {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  // 사용자 모달 열기
  async function handleOpenUserModal(user: User) {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  return (
    <TableRow>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div>{highlightText(post.title, searchQuery)}</div>

          <div className="flex flex-wrap gap-1">
            {post.tags?.map((tag) => (
              <TagView key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleOpenUserModal(post.author)}>
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
          <Button variant="ghost" size="sm" onClick={() => handleOpenPostDetail(post)}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleOpenEditDialog}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handlePostDelete(post)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
