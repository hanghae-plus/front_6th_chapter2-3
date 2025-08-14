import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '../shared/ui';
import { PostsTable } from '../widgets/postsTable/ui/PostsTable';
import { PostsFilter } from '../widgets/postsFilter/ui/PostsFilter';
import { PostsPagination } from '../widgets/postsPagination/ui/PostsPagination';
import { AddPostDialog } from '../features/posts/add-post/ui/AddPostDialog';
import { EditPostDialog } from '../features/posts/edit-post/ui/EditPostDialog';
import { AddCommentDialog } from '../features/comment/add-comment/ui/AddCommentDialog';
import { EditCommentDialog } from '../features/comment/update-comment/ui/EditCommentDialog';
import { UserModal } from '../features/user/view-user/ui/UserModal';
import { PostDetailDialog } from '../features/posts/view-post/ui/PostDetailDialog';
import { deletePost as deletePostAPI } from '../features/posts/delete-post/api/api';

import { usePostsStore } from '../entities/post/model/store';
import { useTagsStore } from '../entities/tags/model/store';
import { highlightText } from '../shared/utils/text';
import PostsHeader from '../widgets/postsHeader/ui/PostsHeader';
import { useDialogStore } from '../shared/store/dialog';
import { DIALOG_KEYS } from '../shared/constant/dialog';
import { useViewUser } from '../features/user/view-user/model/hooks';
import { usePostsUrlParams } from '../features/posts/list-posts/model/hooks';
import { useViewPost } from '../features/posts/view-post/model/hooks';
import { usePostsFilter } from '../features/posts/filter-posts/model/hooks';

const PostsManager = () => {
  const location = useLocation();

  const { posts, total, loading, setSelectedPost } = usePostsStore();
  const { fetchTags: fetchTagsFromStore } = useTagsStore();

  const { skip, limit, setSkip, setLimit } = usePostsUrlParams();

  const { applyFilters } = usePostsFilter();

  const { openUserModal } = useViewUser();
  const { openPostDetail } = useViewPost();
  const { openDialog } = useDialogStore();

  const deletePost = async (id: number) => {
    try {
      await deletePostAPI(id);
      applyFilters();
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };

  useEffect(() => {
    fetchTagsFromStore();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [skip, limit, applyFilters]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
  }, [location.search]);

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <PostsHeader />
      <CardContent>
        <div className='flex flex-col gap-4'>
          <PostsFilter />

          {loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              highlightText={highlightText}
              onUserClick={openUserModal}
              onPostDetail={openPostDetail}
              onEditPost={(post) => {
                setSelectedPost(post);
                openDialog(DIALOG_KEYS.EDIT_POST);
              }}
              onDeletePost={deletePost}
            />
          )}
          <PostsPagination
            skip={skip}
            limit={limit}
            total={total}
            onSkipChange={setSkip}
            onLimitChange={setLimit}
          />
        </div>
      </CardContent>

      <AddPostDialog />
      <EditPostDialog />
      <AddCommentDialog />
      <EditCommentDialog />
      <PostDetailDialog />
      <UserModal />
    </Card>
  );
};

export default PostsManager;
