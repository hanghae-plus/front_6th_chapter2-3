import { ThumbsDown, ThumbsUp } from 'lucide-react';

import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  HighlightText,
} from '@/shared/ui';

export const PostTable = ({
  posts,
  searchQuery,
  selectedTag,
  openUserModal,
  setSelectedTag,
  renderActions,
}) => (
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
      {posts.map((post) => (
        <TableRow key={post.id}>
          <TableCell>{post.id}</TableCell>
          <TableCell>
            <div className='space-y-1'>
              <div>
                <HighlightText text={post.title} highlight={searchQuery} />
              </div>

              <div className='flex flex-wrap gap-1'>
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                      selectedTag === tag
                        ? 'text-white bg-blue-500 hover:bg-blue-600'
                        : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
                    }`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div
              className='flex items-center space-x-2 cursor-pointer'
              onClick={() => openUserModal(post.author)}
            >
              <img
                src={post.author?.image}
                alt={post.author?.username}
                className='w-8 h-8 rounded-full'
              />
              <span>{post.author?.username}</span>
            </div>
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
            <div className='flex items-center gap-2'>{renderActions(post)}</div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
