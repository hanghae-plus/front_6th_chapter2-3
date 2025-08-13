import { Plus } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../shared/ui/components';
import { useDialogStore } from '../../shared/hook/useDialogStore';
import { useQueryParameter } from '../../shared/hook/useQueryParameter';
import { IPost } from '../../entities/post/model/type';
import UserDetail from '../../entities/user/ui/UserDetail';
import AddPostForm from '../../features/post/add-post/ui/AddPostForm';
import UpdatePostForm from '../../features/post/update-post/ui/UpdatePostForm';
import PostFilter from '../../widgets/post-filter/ui/PostFilter';
import PostTable from '../../widgets/post-table/ui/PostTable';
import PostPagination from '../../widgets/post-pagination/ui/PostPagination';
import PostDetail from '../../widgets/post-detail-content/ui/PostDetail';

const PostManagePage = () => {
  const setPostModal = useDialogStore((state) => state.setPostModal);

  const { params } = useQueryParameter();

  const handleAddPost = () => {
    setPostModal({
      show: true,
      content: <AddPostForm />,
    });
  };

  const handlePostClick = (post: IPost) => {
    setPostModal({
      show: true,
      content: <PostDetail post={post} searchQuery={params.searchQuery} />,
    });
  };

  const handleUpdatePost = (post: IPost) => {
    setPostModal({
      show: true,
      content: <UpdatePostForm post={post} />,
    });
  };

  const handleUserClick = (userId: number) => {
    setPostModal({
      show: true,
      content: <UserDetail userId={userId} />,
    });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={handleAddPost}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostFilter />

          {/* 게시물 테이블 */}
          <PostTable
            onClickUser={handleUserClick}
            onClickPost={handlePostClick}
            onUpdatePost={handleUpdatePost}
          />

          {/* 페이지네이션 */}
          <PostPagination />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostManagePage;
