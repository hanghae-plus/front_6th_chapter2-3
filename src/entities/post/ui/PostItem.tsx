import {
  Edit2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { Button, TableCell, TableRow } from '../../../shared/ui/components';
import { HighlightText } from '../../../shared/ui/HighlightText';
import { IPost } from '../model/type';
import PostTagItem from './PostTagItem';

interface PostItemProps {
  // 게시물 데이터
  post: IPost;
  // 하이라이트 처리 검색어
  searchQuery: string;
  // 게시물 필터 태그
  selectedTag: string;

  // 유저 클릭 함수
  onClickUser: (userId: number) => void;
  // 게시물 상세보기 함수
  onClickPost: (post: IPost) => void;

  // 태그 클릭 함수
  onClickTag: (value: string) => void;
  // 게시물 수정
  onUpdatePost: (post: IPost) => void;
  // 게시물 삭제
  onDeletePost: (post: IPost) => void;
}

const PostItem = ({
  post,
  searchQuery,
  selectedTag,
  onClickUser,
  onClickPost,
  onClickTag,
  onUpdatePost,
  onDeletePost,
}: PostItemProps) => {
  return (
    <TableRow key={post.id}>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div>{HighlightText(post.title, searchQuery)}</div>

          <div className="flex flex-wrap gap-1">
            {post.tags?.map((tag) => (
              <PostTagItem
                key={tag}
                tag={tag}
                selectedTag={selectedTag}
                onClickTag={onClickTag}
              />
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => onClickUser(post.userId)}
        >
          <img
            src={post.author?.image}
            alt={post.author?.username}
            className="w-8 h-8 rounded-full"
          />
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
          <Button variant="ghost" size="sm" onClick={() => onClickPost(post)}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onUpdatePost(post)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDeletePost(post)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PostItem;
