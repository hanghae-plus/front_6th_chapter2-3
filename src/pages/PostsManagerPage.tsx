import { useState } from 'react';

import type { PostType, UserType } from '../entities';
import { CreatePostButton, DetailUserModal } from '../features';
import { Card, CardContent, CardHeader, CardTitle, apiClient } from '../shared';
import { Pagination, PostDetailModal, PostTable, PostFilter } from '../widgets';

const PostsManager = () => {
  // 상태 관리
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // 게시물 상세 보기
  const openPostDetail = (post: PostType) => {
    setSelectedPost(post);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (user: UserType) => {
    try {
      const userData = await apiClient.get(`/users/${user.id}`);
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    }
  };

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
          <PostTable onUserClick={openUserModal} onPostDetailClick={openPostDetail} />
          <Pagination />
        </div>
      </CardContent>

      {/* 게시물 상세 보기 모달 */}
      {selectedPost && (
        <PostDetailModal
          isOpen={showPostDetailDialog}
          onOpenChange={setShowPostDetailDialog}
          selectedPost={selectedPost}
          postId={selectedPost?.id}
        />
      )}

      {/* 사용자 모달 */}
      <DetailUserModal
        isOpen={showUserModal}
        onOpenChange={setShowUserModal}
        selectedUser={selectedUser}
      />
    </Card>
  );
};

export default PostsManager;
