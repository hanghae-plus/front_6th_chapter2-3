import { CreatePostButton, DetailUserModal } from '../features';
import { Card, CardContent, CardHeader, CardTitle, ModalProvider, useModal } from '../shared';
import { Pagination, PostDetailModal, PostTable, PostFilter } from '../widgets';

const PostsManagerContent = () => {
  const {
    selectedPost,
    showPostDetailDialog,
    closePostDetail,
    selectedUserId,
    showUserModal,
    closeUserModal,
  } = useModal();

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

      {/* 게시물 상세 보기 모달 */}
      {selectedPost && (
        <PostDetailModal
          isOpen={showPostDetailDialog}
          onOpenChange={closePostDetail}
          selectedPost={selectedPost}
          postId={selectedPost?.id}
        />
      )}

      {/* 사용자 모달 */}
      <DetailUserModal
        isOpen={showUserModal}
        onOpenChange={closeUserModal}
        selectedUserId={selectedUserId ?? 1}
      />
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
