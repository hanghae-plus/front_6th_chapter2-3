import {
  Edit2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/ui/components';
import { HighlightText } from '../../../shared/ui/HighlightText';
import { useQueryParameter } from '../../../shared/hook/useQueryParameter';
import { IPost } from '../../../entities/post/model/type';
import TagItem from '../../../entities/tag/ui/TagItem';
import { usePostsQuery } from '../../../entities/post/model/hook';
import { useUserListQuery } from '../../../entities/user/model/hook';
import { useDeletePost } from '../../../features/post/delete-post/model/useDeletePost';

interface PostTableProps {
  // 유저 클릭 함수
  onClickUser: (userId: number) => void;
  // 게시물 상세보기 함수
  onClickPost: (post: IPost) => void;
  // 게시물 수정
  onUpdatePost: (post: IPost) => void;
}

const PostTable = ({
  onClickUser,
  onClickPost,
  onUpdatePost,
}: PostTableProps) => {
  const { skip, limit, searchQuery, selectedTag, setSelectedTag } =
    useQueryParameter();

  // 태그 및 검색어 처리 필요 (sortBy, sortOrder 처리?)
  const { data: posts, isLoading: isPostLoading } = usePostsQuery(limit, skip);
  const { data: users, isLoading: isUserLoading } = useUserListQuery();

  const postsWithUsers = posts?.posts.map((post) => ({
    ...post,
    author: users?.users.find((user) => user.id === post.userId),
  }));

  const { deletePost } = useDeletePost();

  // const handleSelectedTag = (value: string) => {
  //   setSelectedTag(value);
  // };

  if (isPostLoading || isUserLoading) {
    return <div className="flex justify-center p-4">로딩 중...</div>;
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

      {/* PostList */}
      <TableBody>
        {postsWithUsers?.map((post) => (
          // PostItem
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{HighlightText(post.title, searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <TagItem
                      key={tag}
                      tag={tag}
                      selectedTag={selectedTag}
                      onClickTag={setSelectedTag}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClickPost(post)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdatePost(post)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePost(post)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PostTable;
