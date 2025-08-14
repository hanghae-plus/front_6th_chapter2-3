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
import { usePostDetail } from '@/features/(post)/view-post-detail';
import { AddPostDialog } from '@/features/(post)/add-post';
import { EditPostDialog } from '@/features/(post)/edit-post';
import { CommentList } from '@/features/(comment)/list-comments';
import { AddCommentDialog } from '@/features/(comment)/add-comment';
import { EditCommentDialog } from '@/features/(comment)/edit-comment';
import { useComments } from '@/features/(comment)/list-comments';
import { UserModal } from '@/features/(user)/view-user-modal';
import { useUserModal } from '@/features/(user)/view-user-modal';
import { useTags } from '../model';
import type { Post } from '@/entities/post';
import type { Comment } from '@/entities/comment';
import type { User } from '@/entities/user';

export function PostsManagerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initial = useInitialQueryParams();

  // 상태 관리
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
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { tags } = useTags();
  const { selectedTag, setTag: setSelectedTag } = useTagFilter(queryParams.get('tag') || '');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  // 댓글 입력 상태는 feature dialog 내부에서 관리
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);
  const postDetail = usePostDetail();
  const userModal = useUserModal();

  const { posts, total, loading, refetch } = usePosts({
    limit,
    skip,
    searchQuery,
    tag: selectedTag,
    sortBy: (sortBy as any) || 'none',
    sortOrder: (sortOrder as any) || 'asc',
  });

  // URL 업데이트 함수
  const updateURL = () => {
    updateUrl(navigate, { skip, limit, search: searchQuery, sortBy, sortOrder, tag: selectedTag });
  };

  // 게시물 추가/수정은 feature UI에서 처리

  // 게시물 삭제 후처리 (feature에서 삭제 수행 후 호출됨)
  const onPostDeleted = async (_id: number) => {
    void refetch();
  };

  // 댓글 데이터는 useComments 훅에서 관리

  // 댓글 기능 훅 사용
  const commentsFeature = useComments(selectedPost?.id ?? null);
  // 댓글 추가/수정은 feature dialog에서 처리

  // 댓글 삭제
  const deleteComment = async (id: number) => {
    try {
      await commentsFeature.remove(id);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  // 댓글 좋아요
  const likeComment = async (id: number) => {
    try {
      await commentsFeature.like(id);
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    postDetail.show(post);
  };

  // 사용자 모달 열기 (feature 사용)
  const openUserModal = async (user: User) => {
    if (!user?.id) return;
    await userModal.show(user.id);
  };

  // 태그는 useTags 훅에서 초기 로딩

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

  // 게시물 테이블 렌더링 (Feature UI 사용)
  const renderPostTable = () => (
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
      onEdit={(post) => {
        setSelectedPost(post);
        setShowEditDialog(true);
      }}
      onDelete={(postId) => void onPostDeleted(postId)}
    />
  );

  // 댓글 렌더링
  const renderComments = () => (
    <div className='mt-2'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-sm font-semibold'>댓글</h3>
        <Button
          size='sm'
          onClick={() => {
            setShowAddCommentDialog(true);
          }}
        >
          <Plus className='w-3 h-3 mr-1' />
          댓글 추가
        </Button>
      </div>
      <CommentList
        comments={commentsFeature.comments}
        onLike={(id) => void likeComment(id)}
        onEdit={(comment) => {
          setSelectedComment(comment);
          setShowEditCommentDialog(true);
        }}
        onDelete={(id) => void deleteComment(id)}
      />
    </div>
  );

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <Card.Header>
        <Card.Title className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className='w-4 h-4 mr-2' />
            게시물 추가
          </Button>
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 (Feature UI 사용) */}
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

          {/* 게시물 테이블 */}
          {loading ? <div className='flex justify-center p-4'>로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 (Feature UI 사용) */}
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

      <AddCommentDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        postId={postDetail.post?.id ?? null}
        onSuccess={() => void commentsFeature.refetch()}
      />

      <EditCommentDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onSuccess={() => void commentsFeature.refetch()}
      />

      {/* 게시물 상세 보기 대화상자 (Feature UI) */}
      <PostDetailDialog
        open={postDetail.open}
        post={postDetail.post}
        searchQuery={searchQuery || ''}
        onOpenChange={(o) => {
          if (!o) postDetail.hide();
        }}
      >
        {postDetail.post ? renderComments() : null}
      </PostDetailDialog>

      {/* Feature Dialogs */}
      <AddPostDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => void refetch()}
      />
      <EditPostDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        post={selectedPost}
        onSuccess={() => void refetch()}
      />

      {/* 사용자 모달 (Feature UI 사용) */}
      <UserModal
        open={userModal.open}
        user={userModal.user}
        onOpenChange={(o) => {
          if (!o) userModal.hide();
        }}
      />
    </Card>
  );
}
