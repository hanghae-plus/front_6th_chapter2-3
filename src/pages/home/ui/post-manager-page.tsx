import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button, Card } from '@/shared/ui';
import { PostTable } from '@/features/(post)/list-posts';
import { usePosts } from '@/features/(post)/list-posts';
import { useTagFilter } from '@/features/(post)/filter-by-tag';
import { usePostSearch } from '@/features/(post)/search-posts';
import { PaginationControls } from '@/features/(post)/paginate-posts';
import { usePagination } from '@/features/(post)/paginate-posts';
import { usePostSort } from '@/features/(post)/sort-posts';
import { useComments } from '@/features/(comment)/list-comments';
import { useInitialQueryParams, useTags, useUrlSync, useDialogHandlers } from '../model';
import { PostFilters } from './post-filters';
import type { Post } from '@/entities/post';
import type { User } from '@/entities/user';
import { useDialog } from '@/shared/utils';

export function PostsManagerPage() {
  const initial = useInitialQueryParams();
  const { open, close } = useDialog();

  // 상태 관리 훅들
  const { limit, skip, next, prev, setPageSize, setSkip } = usePagination(
    initial.limit,
    initial.skip,
  );
  const { searchQuery, setQuery } = usePostSearch(initial.searchQuery);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const {
    sortBy,
    sortOrder,
    setBy: setSortBy,
    setOrder: setSortOrder,
  } = usePostSort(initial.sortBy, initial.sortOrder);
  const { tags } = useTags();
  const { selectedTag, setTag: setSelectedTag } = useTagFilter(initial.selectedTag);

  const { updateURL } = useUrlSync(
    { skip, limit, searchQuery, sortBy, sortOrder, selectedTag },
    { setSkip, setPageSize, setQuery, setSortBy, setSortOrder, setSelectedTag },
    initial,
  );

  const commentsFeature = useComments(selectedPost?.id ?? null);

  const { openAddPostDialog, openEditPostDialog, onPostDeleted, openPostDetail, openUserModal } =
    useDialogHandlers({ open, close }, selectedPost, setSelectedPost, commentsFeature, searchQuery);

  const { posts, total, loading } = usePosts({
    limit,
    skip,
    searchQuery,
    tag: selectedTag,
    sortBy,
    sortOrder,
  });

  const handleTagChange = useCallback(
    (value: string) => {
      setSelectedTag(value);
      updateURL();
    },
    [setSelectedTag, updateURL],
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      setSelectedTag(tag);
      updateURL();
    },
    [setSelectedTag, updateURL],
  );

  const handleUserOpen = useCallback(
    (userId: number) => {
      openUserModal({ id: userId } as User);
    },
    [openUserModal],
  );

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <Card.Header>
        <Card.Title className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <Button onClick={openAddPostDialog}>
            <Plus className='w-4 h-4 mr-2' />
            게시물 추가
          </Button>
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className='flex flex-col gap-4'>
          <PostFilters
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            sortBy={sortBy}
            sortOrder={sortOrder}
            tags={tags}
            onSearchChange={setQuery}
            onTagChange={handleTagChange}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            onTagClick={handleTagClick}
          />

          {loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              loading={loading}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onClickTag={handleTagClick}
              onOpenDetail={openPostDetail}
              onOpenUser={handleUserOpen}
              onEdit={openEditPostDialog}
              onDelete={onPostDeleted}
            />
          )}

          <PaginationControls
            limit={limit}
            skip={skip}
            total={total}
            onPrev={prev}
            onNext={next}
            onChangeLimit={(v) => setPageSize(v)}
          />
        </div>
      </Card.Content>
    </Card>
  );
}
