import { CreatePostButton, DetailUserModal } from '../../../features';
import { Card, CardContent, CardHeader, CardTitle, ModalProvider } from '../../../shared';
import { Pagination, PostDetailModal, PostTable, PostFilter } from '../../../widgets';

const PostsManagerContent = () => {
  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <CreatePostButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          <PostFilter />
          <PostTable />
          <Pagination />
        </div>
      </CardContent>

      {/* 모달들 - props 없이 자체적으로 상태 관리 */}
      <PostDetailModal />
      <DetailUserModal />
    </Card>
  );
};

const PostsManager = () => {
  return (
    <ModalProvider>
      <PostsManagerContent />
    </ModalProvider>
  );
};

export default PostsManager;
