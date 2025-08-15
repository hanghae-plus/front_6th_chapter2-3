import { Edit2 } from 'lucide-react';
import { useState } from 'react';

import type { PostType, UserType } from '../entities';
import {
  CreatePostButton,
  CreateCommentButton,
  DetailUserModal,
  DeleteCommentButton,
  LikeCommentButton,
  TagSelectFilter,
  SortOrderSelectFilter,
  SortBySelectFilter,
  SearchInputFilter,
  UpdateCommentButton,
} from '../features';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  highlightText,
} from '../shared';
import { Pagination, PostTable } from '../widgets';

const PostsManager = () => {
  // 상태 관리
  const [searchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState({});
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // 댓글 가져오기
  const fetchComments = async (postId) => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      const data = await response.json();
      console.log('댓글> ', data);
      setComments((prev) => ({ ...prev, [postId]: data.comments }));
    } catch (error) {
      console.error('댓글 가져오기 오류:', error);
    }
  };

  // 게시물 상세 보기
  const openPostDetail = (post: PostType) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (user: UserType) => {
    try {
      const response = await fetch(`/api/users/${user.id}`);
      const userData = await response.json();
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    }
  };

  // 댓글 렌더링
  const renderComments = (postId) => (
    <div className='mt-2'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-sm font-semibold'>댓글</h3>
        <CreateCommentButton postId={postId} />
      </div>
      <div className='space-y-1'>
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className='flex items-center justify-between text-sm border-b pb-1'>
            <div className='flex items-center space-x-2 overflow-hidden'>
              <span className='font-medium truncate'>{comment.user.username}:</span>
              <span className='truncate'>{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className='flex items-center space-x-1'>
              <LikeCommentButton commentId={comment.id} postId={postId} likes={comment.likes} />
              <UpdateCommentButton comment={comment} />
              <DeleteCommentButton commentId={comment.id} postId={postId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
          {/* 검색 및 필터 컨트롤 */}
          <div className='flex gap-4'>
            <SearchInputFilter />
            <TagSelectFilter />
            <SortBySelectFilter />
            <SortOrderSelectFilter />
          </div>

          <PostTable onUserClick={openUserModal} onPostDetailClick={openPostDetail} />
          <Pagination />
        </div>
      </CardContent>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
            <DialogDescription>게시물의 상세 내용과 댓글을 확인할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <p>{highlightText(selectedPost?.body, searchQuery)}</p>
            {renderComments(selectedPost?.id)}
          </div>
        </DialogContent>
      </Dialog>

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
