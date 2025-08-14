import { Plus, Search } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../shared/ui';
import { usePostFeature } from '../features/post';
import { useCommentFeature } from '../features/comment';
import { useUserFeature } from '../features/user';
import { PostTable } from '../widgets/PostTable';
import { PostForm, PostDetail } from '../features/post/ui';
import { CommentForm, CommentList } from '../features/comment/ui';
import { UserProfile } from '../features/user/ui';
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

  // 게시물 상세 보기 (댓글도 함께 가져오기)
  const openPostDetailWithComments = (post: any) => {
    openPostDetail(post);
    handleFetchComments(post.id);
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
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className='w-4 h-4 mr-2' />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <div className='flex gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='게시물 검색...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchPosts()}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value);
                handleFetchPostsByTag(value);
                updateURL();
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='태그 선택' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>모든 태그</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='정렬 기준' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>없음</SelectItem>
                <SelectItem value='id'>ID</SelectItem>
                <SelectItem value='title'>제목</SelectItem>
                <SelectItem value='reactions'>반응</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='정렬 순서' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>오름차순</SelectItem>
                <SelectItem value='desc'>내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              updateURL={updateURL}
              openUserModal={openUserModal}
              openPostDetail={openPostDetailWithComments}
              setSelectedPost={setSelectedPost}
              setShowEditDialog={setShowEditDialog}
              handleDeletePost={handleDeletePost}
            />
          )}

          {/* 페이지네이션 */}
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <span>표시</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='10' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='30'>30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className='flex gap-2'>
              <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
                이전
              </Button>
              <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

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
    </Card>
  );
};

export default PostsManager;
