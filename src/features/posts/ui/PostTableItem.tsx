import { ThumbsDown, ThumbsUp } from 'lucide-react';
import TableTag from '../ui/TableTag';
import PostUserTrigger from './PostUserTrigger.tsx';
import PostTableDetailButton from './PostTableDetailButton.tsx';
import PostTableEditingButton from './PostTableEditingButton.tsx';
import PostTableDeleteButton from './PostTableDeleteButton.tsx';
import { Post } from '@/entities/posts';
import { Table } from '@/shared/ui/table';
import { highlightText } from '@/shared/lib/highlightText.tsx';
interface PostTableItemProps {
  post: Post;
  searchQuery: string;
}

const PostTableItem = ({ post, searchQuery }: PostTableItemProps) => {
  return (
    <Table.Row key={post.id}>
      <Table.Cell>{post.id}</Table.Cell>
      <Table.Cell>
        <div className="space-y-1">
          <div>{highlightText(post.title, searchQuery)}</div>
          <TableTag tags={post.tags} />
        </div>
      </Table.Cell>
      <PostUserTrigger author={post.author} />
      <Table.Cell>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.reactions?.likes || 0}</span>
          <ThumbsDown className="w-4 h-4" />
          <span>{post.reactions?.dislikes || 0}</span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          {/*디테일*/}
          <PostTableDetailButton post={post} />
          {/*에디팅*/}
          <PostTableEditingButton post={post} />
          {/*삭제*/}
          <PostTableDeleteButton post={post} />
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

export default PostTableItem;
