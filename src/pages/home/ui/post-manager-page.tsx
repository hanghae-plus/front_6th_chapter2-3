import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInitialQueryParams } from '../model/useInitialQueryParams';
import { updateUrl } from '../lib/updateUrl';
import { Button, Card } from '@/shared/ui';
import { PostTable } from '@/features/(post)/list-posts';
import { usePosts } from '@/features/(post)/list-posts';
import { TagFilterSelect } from '@/features/(post)/filter-by-tag';
import { useTagFilter } from '@/features/(post)/filter-by-tag';
import { SearchInput } from '@/features/(post)/search-posts';
import { usePostSearch } from '@/features/(post)/search-posts';
import { PaginationControls } from '@/features/(post)/paginate-posts';
import { usePagination } from '@/features/(post)/paginate-posts';
import { SortSelect } from '@/features/(post)/sort-posts';
import { usePostSort } from '@/features/(post)/sort-posts';
import { PostDetailDialog } from '@/features/(post)/view-post-detail';

import { AddPostDialog } from '@/features/(post)/add-post';
import { EditPostDialog } from '@/features/(post)/edit-post';

import { AddCommentDialog } from '@/features/(comment)/add-comment';
import { EditCommentDialog } from '@/features/(comment)/edit-comment';
import { useComments } from '@/features/(comment)/list-comments';
import { UserModal } from '@/features/(user)/view-user-modal';

import { useTags } from '../model';
import type { Post } from '@/entities/post';
import type { Comment } from '@/entities/comment';
import type { User } from '@/entities/user';
import { userApi } from '@/entities/user';
import { useDialog } from '@/shared/utils';

export function PostsManagerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initial = useInitialQueryParams();

  const { open, close } = useDialog();
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
  } = usePostSort(
    (queryParams.get('sortBy') as any) || 'none',
    (queryParams.get('sortOrder') as any) || 'asc',
  );
  const { tags } = useTags();
  const { selectedTag, setTag: setSelectedTag } = useTagFilter(queryParams.get('tag') || '');

  const openAddPostDialog = () =>
    open(AddPostDialog, {
      open: true,
      onOpenChange: () => close(AddPostDialog),
      onSuccess: () => void refetch(),
    });

  const openEditPostDialog = (post: Post) =>
    open(EditPostDialog, {
      open: true,
      onOpenChange: () => close(EditPostDialog),
      post,
      onSuccess: refetch,
    });

  const openAddCommentDialog = () =>
    open(AddCommentDialog, {
      open: true,
      onOpenChange: () => close(AddCommentDialog),
      postId: selectedPost?.id ?? null,
      onSuccess: () => void commentsFeature.refetch(),
    });

  const openEditCommentDialog = (comment: Comment) =>
    open(EditCommentDialog, {
      open: true,
      onOpenChange: () => close(EditCommentDialog),
      comment,
      onSuccess: () => void commentsFeature.refetch(),
    });

  const { posts, total, loading, refetch } = usePosts({
    limit,
    skip,
    searchQuery,
    tag: selectedTag,
    sortBy: (sortBy as any) || 'none',
    sortOrder: (sortOrder as any) || 'asc',
  });

  const updateURL = () => {
    updateUrl(navigate, { skip, limit, search: searchQuery, sortBy, sortOrder, tag: selectedTag });
  };

  const onPostDeleted = async (_id: number) => refetch();

  const commentsFeature = useComments(selectedPost?.id ?? null);

  const deleteComment = async (id: number) => {
    try {
      await commentsFeature.remove(id);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  const likeComment = async (id: number) => {
    try {
      await commentsFeature.like(id);
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    open(PostDetailDialog, {
      open: true,
      onOpenChange: () => {
        close(PostDetailDialog);
        setSelectedPost(null);
      },
      post,
      searchQuery: searchQuery || '',
      commentsFeature,
      onAddComment: openAddCommentDialog,
      onEditComment: openEditCommentDialog,
      onDeleteComment: deleteComment,
      onLikeComment: likeComment,
    });
  };

  const openUserModal = async (user: User) => {
    if (!user?.id) return;

    try {
      const userData = await userApi.getUserById(user.id);
      open(UserModal, {
        open: true,
        onOpenChange: () => close(UserModal),
        user: userData,
      });
    } catch (error) {
      console.error('사용자 정보 로드 오류:', error);
    }
  };

  useEffect(() => {
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag, searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || String(initial.skip)));
    setPageSize(parseInt(params.get('limit') || String(initial.limit)));
    setQuery(params.get('search') || initial.searchQuery);
    setSortBy((params.get('sortBy') as any) || initial.sortBy);
    setSortOrder((params.get('sortOrder') as any) || initial.sortOrder);
    setSelectedTag(params.get('tag') || initial.selectedTag);
  }, [
    location.search,
    setQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,
    initial.skip,
    initial.limit,
    initial.searchQuery,
    initial.sortBy,
    initial.sortOrder,
    initial.selectedTag,
    setPageSize,
    setSkip,
  ]);

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
          <div className='flex gap-4'>
            <div className='flex-1'>
              <SearchInput value={searchQuery} onChange={setQuery} onEnter={() => void refetch()} />
            </div>
            <TagFilterSelect
              value={selectedTag}
              tags={tags}
              onChange={(value) => {
                setSelectedTag(value);
                updateURL();
              }}
            />
            <SortSelect
              sortBy={sortBy as any}
              sortOrder={sortOrder as any}
              onChangeBy={(v) => setSortBy(v as any)}
              onChangeOrder={(v) => setSortOrder(v as any)}
            />
          </div>

          {loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              loading={loading}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onClickTag={(tag) => {
                setSelectedTag(tag);
                updateURL();
              }}
              onOpenDetail={(post) => openPostDetail(post)}
              onOpenUser={(userId) => openUserModal({ id: userId } as User)}
              onEdit={(post) => openEditPostDialog(post)}
              onDelete={(postId) => onPostDeleted(postId)}
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
