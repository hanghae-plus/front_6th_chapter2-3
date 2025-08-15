import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Post } from '../../../entities/post';
import { PostDetailManager, usePostDetail } from '../../../features/post-detail';
import { usePostDialogs } from '../../../features/post-crud';
import { PostFormManager, PostHeader } from '../../../features/post-crud/ui';
import { usePostFilter } from '../../../features/post-filter';
import { FilterControls } from '../../../features/post-filter/ui';
import { usePostList } from '../../../features/post-list';
import { PostPagination, PostTableManager } from '../../../features/post-list/ui';
import { usePostSearch } from '../../../features/post-search';
import { SearchBar } from '../../../features/post-search/ui';
import { UserModalManager } from '../../../features/user-profile';
import { Card, CardContent } from '../../../shared';

const PostManagerWidget: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { total, loading, skip, limit, fetchPosts, setSkip, setLimit } = usePostList();
  
  const {
    showAddDialog,
    showEditDialog,
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,
  } = usePostDialogs();

  console.log('Dialog states:', { showAddDialog, showEditDialog });

  const { searchQuery, setSearchQuery, searchPosts } = usePostSearch();

  const {
    sortBy,
    sortOrder,
    selectedTag,
    tags,
    setSortBy,
    setSortOrder,
    setSelectedTag,
    fetchTags,
    fetchPostsByTag,
  } = usePostFilter();

  const { openPostDetail } = usePostDetail();

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

  // 게시물 상세 보기
  const handleOpenPostDetail = (post: Post) => {
    openPostDetail(post);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts(skip, limit);
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newSkip = parseInt(params.get('skip') || '0');
    const newLimit = parseInt(params.get('limit') || '10');
    setSkip(newSkip);
    setLimit(newLimit);
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || 'asc');
    setSelectedTag(params.get('tag') || '');
  }, [location.search]);

  return (
    <Card className='mx-auto w-full max-w-6xl'>
      <PostHeader onAddPost={openAddDialog} />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <div className='flex gap-4'>
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={searchPosts}
            />
            <FilterControls
              sortBy={sortBy}
              sortOrder={sortOrder}
              selectedTag={selectedTag}
              tags={tags}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
              onTagChange={(tag: string) => {
                setSelectedTag(tag);
                fetchPostsByTag(tag);
                updateURL();
              }}
            />
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTableManager onOpenPostDetail={handleOpenPostDetail} />
          )}

          {/* 페이지네이션 */}
          <PostPagination
            limit={limit}
            skip={skip}
            total={total}
            onLimitChange={setLimit}
            onSkipChange={setSkip}
          />
        </div>
      </CardContent>

      {/* 게시물 추가/수정 폼 */}
      <PostFormManager
        isOpen={showAddDialog || showEditDialog}
        onOpenChange={open => {
          if (!open) {
            closeAddDialog();
            closeEditDialog();
          }
        }}
        mode={showAddDialog ? 'add' : 'edit'}
      />


      {/* 게시물 상세 보기 */}
      <PostDetailManager />

      {/* 사용자 모달 */}
      <UserModalManager />
    </Card>
  );
};

export default PostManagerWidget;