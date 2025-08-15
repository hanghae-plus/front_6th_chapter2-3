// features/post/ui/PostRenderUi.tsx
import { PostTagList } from './PostTagList'
import { PostAuthorCell } from './PostAuthorCell'
import { PostActions } from './PostActions'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/shared/ui'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { Post } from '@/entities/post/model/types'
import { highlightText } from '@/shared/utils/highlightText'

export const PostRenderUi = ({
  posts,
  searchQuery,
  selectedTag,
  setSelectedTag,
  updateURL,
  openUserModal,
  openPostDetail,
  setSelectedPost,
  setShowEditDialog,
  deletePost,
}: any) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className='w-[50px]'>ID</TableHead>
        <TableHead>제목</TableHead>
        <TableHead className='w-[150px]'>작성자</TableHead>
        <TableHead className='w-[150px]'>반응</TableHead>
        <TableHead className='w-[150px]'>작업</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {posts.map((post: Post) => (
        <TableRow key={post.id}>
          <TableCell>{post.id}</TableCell>
          <TableCell>
            <div className='space-y-1'>
              <div>{highlightText(post.title, searchQuery)}</div>
              <PostTagList
                tags={post.tags}
                selectedTag={selectedTag}
                onSelectTag={(tag) => {
                  setSelectedTag(tag)
                  updateURL()
                }}
              />
            </div>
          </TableCell>
          <TableCell>
            <PostAuthorCell
              author={post.author}
              onClick={() => openUserModal(post.author)}
            />
          </TableCell>
          <TableCell>
            <div className='flex items-center gap-2'>
              <ThumbsUp className='w-4 h-4' />
              <span>{post.reactions?.likes || 0}</span>
              <ThumbsDown className='w-4 h-4' />
              <span>{post.reactions?.dislikes || 0}</span>
            </div>
          </TableCell>
          <TableCell>
            <PostActions
              post={post}
              onView={openPostDetail}
              onEdit={(p) => {
                setSelectedPost(p)
                setShowEditDialog(true)
              }}
              onDelete={deletePost}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
