import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/ui/components';
import { useQueryParameter } from '../../../shared/hook/useQueryParameter';
import { IPost } from '../../../entities/post/model/type';
import PostList from '../../../entities/post/ui/PostList';
import { usePostListQuery } from '../../../entities/post/model/hook';
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
  const { params, setters } = useQueryParameter();

  const { data: posts, isLoading: isPostLoading } = usePostListQuery(params);
  const { data: users, isLoading: isUserLoading } = useUserListQuery();

  const postsWithUsers = posts?.posts.map((post) => ({
    ...post,
    author: users?.users.find((user) => user.id === post.userId),
  }));

  const { deletePost } = useDeletePost();

  const handleSelectedTag = (value: string) => {
    setters.setSelectedTag(value);
  };

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

      {/* 게시글 목록 */}
      <PostList
        posts={postsWithUsers}
        searchQuery={params.searchQuery}
        selectedTag={params.selectedTag}
        onClickUser={onClickUser}
        onClickPost={onClickPost}
        onClickTag={handleSelectedTag}
        onUpdatePost={onUpdatePost}
        onDeletePost={deletePost}
      />
    </Table>
  );
};

export default PostTable;
