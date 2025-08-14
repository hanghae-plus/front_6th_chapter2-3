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

import { usePostsStore } from '../entities/post/model/store';
import { highlightText } from '../shared/utils/text';
import PostsHeader from '../widgets/postsHeader/ui/PostsHeader';
import { useDialogStore } from '../shared/store/dialog';
import { DIALOG_KEYS } from '../shared/constant/dialog';
import { useViewUser } from '../features/user/view-user/model/hooks';
import { useViewPost } from '../features/posts/view-post/model/hooks';
import { useDeletePost } from '../features/posts/delete-post/model/hooks';
import { usePagination } from '../features/posts/pagination/model/hooks';
import { usePostsInitialization } from '../features/posts/initialization/model/hooks';

const PostsManager = () => {
  const { posts, total, loading, setSelectedPost } = usePostsStore();

  const { openUserModal } = useViewUser();
  const { openPostDetail } = useViewPost();
  const { deletePost } = useDeletePost();
  const { skip, limit, setSkip, setLimit } = usePagination();
  const { openDialog } = useDialogStore();

  usePostsInitialization();

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
