import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { usePostsManagerController } from './model/usePostsManagerController';
import CommentAddDialog from '../../features/CommentAddDialog';
import CommentEditDialog from '../../features/CommentEditDialog';
import PaginationControls from '../../features/PaginationControls';
import PostAddDialog from '../../features/PostAddDialog';
import PostDetailDialog from '../../features/PostDetailDialog';
import PostEditDialog from '../../features/PostEditDialog';
import PostsControls from '../../features/PostsControls';
import UserModal from '../../features/UserModal';
import { Card, CardContent } from '../../shared/ui';
import PostsHeader from '../../widgets/PostsHeader';
import PostsTable from '../../widgets/PostsTable';

const PostsManagerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 상태/액션 훅 (pages 전용 컨트롤러)
  const {
    skip,
    setSkip,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTag,
    setSelectedTag,
  } = usePostsManagerController();

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set('skip', skip.toString());
    if (limit) params.set('limit', limit.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);
    navigate(`?${params.toString()}`);
  };

  useEffect(() => {
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag, searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder((params.get('sortOrder') as 'asc' | 'desc') || 'asc');
    setSelectedTag(params.get('tag') || '');
  }, [location.search]);

  return (
    <main className='flex-grow container mx-auto px-4 py-8'>
      <Card className='w-full max-w-6xl mx-auto'>
        <PostsHeader title='게시물 관리자' />

        <CardContent>
          <div className='flex flex-col gap-4'>
            {/* 검색 및 필터 컨트롤 - Feature */}
            <PostsControls />

            {/* 게시물 테이블 - Widget */}
            <PostsTable />

            {/* 페이지네이션 - Feature */}
            <PaginationControls />
          </div>
        </CardContent>

        {/* 게시물 추가 대화상자 */}
        <PostAddDialog />

        {/* 게시물 수정 대화상자 */}
        <PostEditDialog />

        {/* 댓글 추가 대화상자 */}
        <CommentAddDialog />

        {/* 댓글 수정 대화상자 */}
        <CommentEditDialog />

        {/* 게시물 상세 보기 - Widget */}
        <PostDetailDialog />

        {/* 사용자 모달 - Widget */}
        <UserModal />
      </Card>
    </main>
  );
};

export default PostsManagerPage;
