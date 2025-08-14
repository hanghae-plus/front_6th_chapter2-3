import { usePostFeature } from '../features/post';
import { useCommentFeature } from '../features/comment';
import { useUserFeature } from '../features/user';
import { PostManager } from '../widgets/PostManager';
import { PostForm, PostDetail } from '../features/post/ui';
import { CommentForm, CommentList } from '../features/comment/ui';
import { UserProfile } from '../features/user/ui';
import { openPostDetailWithComments as openPostDetailWithCommentsUtil } from '../entities/post/model';
import {
  handleAddCommentWithPostId as handleAddCommentWithPostIdUtil,
  handleAddCommentWithData as handleAddCommentWithDataUtil,
} from '../entities/comment/model';

const PostsManager = () => {
  // Post Feature 사용
  const {
    posts,
    total,
    skip,
    limit,
    searchQuery,
    selectedPost,
    sortBy,
    sortOrder,
    showAddDialog,
    showEditDialog,
    newPost,
    loading,
    tags,
    selectedTag,
    showPostDetailDialog,
    setSkip,
    setLimit,
    setSearchQuery,
    setSelectedPost,
    setSortBy,
    setSortOrder,
    setShowAddDialog,
    setShowEditDialog,
    setNewPost,
    setSelectedTag,
    setShowPostDetailDialog,
    updateURL,
    openPostDetail,
    handleSearchPosts,
    handleFetchPostsByTag,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
  } = usePostFeature();

  // User Feature 사용
  const { showUserModal, user, setShowUserModal, openUserModal } = useUserFeature();

  // Comment Feature 사용 (컴포넌트 최상위에서 호출)
  const {
    comments,
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    handleFetchComments,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    setComments,
  } = useCommentFeature();

  // 게시물 상세 보기 (댓글도 함께 가져오기) - entities 함수 사용
  const openPostDetailWithComments = (post: any) => {
    openPostDetailWithCommentsUtil(post, openPostDetail, handleFetchComments);
  };

  // 댓글 추가 시 postId 설정 (entities 함수 사용)
  const handleAddCommentWithPostId = () => {
    handleAddCommentWithPostIdUtil(
      selectedPost,
      newComment,
      setNewComment,
      handleAddCommentWithData,
    );
  };

  // 특정 데이터로 댓글 추가하는 함수 (entities 함수 사용)
  const handleAddCommentWithData = (commentData: any) => {
    handleAddCommentWithDataUtil(
      commentData,
      setComments,
      comments,
      setShowAddCommentDialog,
      setNewComment,
    );
  };

  return (
    <>
      <PostManager
        posts={posts}
        total={total}
        skip={skip}
        limit={limit}
        searchQuery={searchQuery}
        sortBy={sortBy}
        sortOrder={sortOrder}
        selectedTag={selectedTag}
        loading={loading}
        tags={tags}
        setSkip={setSkip}
        setLimit={setLimit}
        setSearchQuery={setSearchQuery}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        setSelectedTag={setSelectedTag}
        updateURL={updateURL}
        handleSearchPosts={handleSearchPosts}
        handleFetchPostsByTag={handleFetchPostsByTag}
        openPostDetail={openPostDetailWithComments}
        setSelectedPost={setSelectedPost}
        setShowEditDialog={setShowEditDialog}
        handleDeletePost={handleDeletePost}
        openUserModal={openUserModal}
        setShowAddDialog={setShowAddDialog}
      />

      {/* 게시물 추가 대화상자 */}
      <PostForm
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        title='새 게시물 추가'
        post={newPost}
        onPostChange={setNewPost}
        onSubmit={handleAddPost}
        submitText='게시물 추가'
        isEdit={false}
      />

      {/* 게시물 수정 대화상자 */}
      <PostForm
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        title='게시물 수정'
        post={selectedPost || { title: '', body: '', userId: 1 }}
        onPostChange={(post) => {
          if (selectedPost) {
            setSelectedPost({ ...selectedPost, ...post });
          }
        }}
        onSubmit={handleUpdatePost}
        submitText='게시물 업데이트'
        isEdit={true}
      />

      {/* 댓글 추가 대화상자 */}
      <CommentForm
        isOpen={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        title='새 댓글 추가'
        comment={newComment}
        onCommentChange={(comment) => setNewComment({ ...newComment, ...comment })}
        onSubmit={handleAddCommentWithPostId}
        submitText='댓글 추가'
      />

      {/* 댓글 수정 대화상자 */}
      <CommentForm
        isOpen={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        title='댓글 수정'
        comment={selectedComment || { body: '', postId: null, userId: 1 }}
        onCommentChange={(comment) => {
          if (selectedComment) {
            setSelectedComment({ ...selectedComment, ...comment });
          }
        }}
        onSubmit={handleUpdateComment}
        submitText='댓글 업데이트'
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetail
        isOpen={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        searchQuery={searchQuery}
      >
        {selectedPost && (
          <CommentList
            postId={selectedPost.id}
            comments={comments}
            searchQuery={searchQuery}
            onAddComment={() => setShowAddCommentDialog(true)}
            onEditComment={(comment) => {
              setSelectedComment(comment);
              setShowEditCommentDialog(true);
            }}
            onLikeComment={handleLikeComment}
            onDeleteComment={handleDeleteComment}
          />
        )}
      </PostDetail>

      {/* 사용자 모달 */}
      <UserProfile isOpen={showUserModal} onOpenChange={setShowUserModal} user={user} />
    </>
  );
};

export default PostsManager;
