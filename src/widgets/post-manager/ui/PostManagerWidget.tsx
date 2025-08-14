import { useMemo, useState } from 'react';

import {
  useAddComment,
  useDeleteComment,
  useFetchComments,
  useLikeComment,
  useUpdateComment,
} from '@/entities/comment/model/useComments';
import { CommentList } from '@/entities/comment/ui/CommentList';
import {
  useFetchPosts,
  useFetchTags,
  useSearchPosts,
  useFetchPostsByTag,
} from '@/entities/post/model/usePosts';
import { PostTable } from '@/entities/post/ui/PostTable';
import { useFetchAllUsers, useFetchUserById } from '@/entities/user/model/useUsers';
import { CreateCommentDialog } from '@/features/comment-create/ui/CreateCommentDialog';
import { EditCommentDialog } from '@/features/comment-edit/ui/EditCommentDialog';
import { useCreatePost } from '@/features/post-create/model/useCreatePost';
import { CreatePostButton } from '@/features/post-create/ui/CreatePostButton';
import { CreatePostDialog } from '@/features/post-create/ui/CreatePostDialog';
import { DeletePostButton } from '@/features/post-delete/ui/DeletePostButton';
import { EditPostButton } from '@/features/post-edit/ui/EditPostButton';
import { EditPostDialog } from '@/features/post-edit/ui/EditPostDialog';
import { usePostFilter } from '@/features/post-filter/model/usePostFilter';
import { PostFilter } from '@/features/post-filter/ui/PostFilter';
import { usePagination } from '@/features/post-pagination/model/usePagination';
import { Pagination } from '@/features/post-pagination/ui/Pagination';
import { usePostSearch } from '@/features/post-search/model/usePostSearch';
import { PostSearch } from '@/features/post-search/ui/PostSearch';
import { ViewPostButton } from '@/features/post-view/ui/ViewPostButton';
import { ViewPostDialog } from '@/features/post-view/ui/ViewPostDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { UserProfileDialog } from '@/widgets/user-profile-dialog/ui/UserProfileDialog';

export const PostManagerWidget = () => {
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);

  const [newComment, setNewComment] = useState({ body: '', postId: null, userId: 1 });

  const { skip, limit, setSkip, setLimit } = usePagination();
  const { selectedTag, setSelectedTag } = usePostFilter();
  const { searchQuery } = usePostSearch();

  const { data: tagsData } = useFetchTags();
  const { data: searchData } = useSearchPosts(searchQuery);
  const { data: tagData } = useFetchPostsByTag(selectedTag);
  const { data: postsData, isLoading: isLoadingPosts } = useFetchPosts(limit, skip);

  const finalData = searchData || tagData || postsData;
  const total = finalData?.total || 0;
  const tags = tagsData || [];

  const {
    showDialog: showAddDialog,
    setShowDialog: setShowAddDialog,
    newPost,
    setNewPost,
    openDialog: openAddDialog,
    handleSubmit,
  } = useCreatePost();

  const { data: comments } = useFetchComments(selectedPostId);
  const { mutate: addComment } = useAddComment();
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: likeComment } = useLikeComment();

  const { data: usersData } = useFetchAllUsers();
  const { data: user } = useFetchUserById(selectedUserId);

  const postsWithAuthors = useMemo(() => {
    if (!finalData || !usersData) return [];

    return finalData.posts.map((post) => ({
      ...post,
      author: usersData.find((user) => user.id === post.userId),
    }));
  }, [searchData, tagData, postsData, usersData]);

  // 사용자 모달 열기
  const openUserModal = async (user) => {
    setSelectedUserId(user.id);
    setShowUserModal(true);
  };

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <CreatePostButton onClick={openAddDialog} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <div className='flex gap-4'>
            <PostSearch />
            <PostFilter tags={tags} />
          </div>

          {/* 게시물 테이블 */}
          {isLoadingPosts ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTable
              posts={postsWithAuthors}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              openUserModal={openUserModal}
              setSelectedTag={setSelectedTag}
              renderActions={(post) => (
                <>
                  <ViewPostButton post={post} />
                  <EditPostButton post={post} />
                  <DeletePostButton postId={post?.id} />
                </>
              )}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            total={total}
            limit={limit}
            skip={skip}
            setSkip={setSkip}
            setLimit={setLimit}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <CreatePostDialog
        open={showAddDialog}
        onOpenChange={() => setShowAddDialog(!showAddDialog)}
        newPost={newPost}
        setNewPost={setNewPost}
        onSubmit={handleSubmit}
      />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog />

      {/* 댓글 추가 대화상자 */}
      <CreateCommentDialog
        showAddCommentDialog={showAddCommentDialog}
        setShowAddCommentDialog={setShowAddCommentDialog}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
      />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog
        showEditCommentDialog={showEditCommentDialog}
        setShowEditCommentDialog={setShowEditCommentDialog}
        selectedComment={selectedComment}
        updateComment={updateComment}
        setSelectedComment={setSelectedComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <ViewPostDialog>
        <CommentList
          postId={selectedPostId}
          setNewComment={setNewComment}
          setShowAddCommentDialog={setShowAddCommentDialog}
          comments={comments}
          searchQuery={searchQuery}
          likeComment={likeComment}
          setSelectedComment={setSelectedComment}
          setShowEditCommentDialog={setShowEditCommentDialog}
          deleteComment={deleteComment}
        />
      </ViewPostDialog>

      {/* 사용자 모달 */}
      <UserProfileDialog
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        user={user}
      />
    </Card>
  );
};
