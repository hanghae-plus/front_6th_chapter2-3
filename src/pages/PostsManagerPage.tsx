import { Plus, Search } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '../shared/ui';
import { usePostFeature } from '../features/post';
import { useCommentFeature } from '../features/comment';
import { useUserFeature } from '../features/user';
import { PostTable } from '../widgets/PostTable';
import { Comments } from '../widgets/Comments';
import { highlightText } from '../shared/utils';

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

  // 디버깅용 로그
  console.log('=== PostsManager 렌더링 ===');
  console.log('posts:', posts);
  console.log('loading:', loading);
  console.log('handleDeletePost:', handleDeletePost);
  console.log('typeof handleDeletePost:', typeof handleDeletePost);

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
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    setComments,
  } = useCommentFeature();

  // Comment Feature 디버깅용 로그
  console.log('=== Comment Feature 상태 ===');
  console.log('comments:', comments);
  console.log('handleFetchComments:', handleFetchComments);
  console.log('typeof handleFetchComments:', typeof handleFetchComments);

  // 게시물 상세 보기 (댓글도 함께 가져오기)
  const openPostDetailWithComments = (post: any) => {
    console.log('게시물 상세 보기 열기:', post);
    openPostDetail(post);
    console.log('댓글 가져오기 시작, postId:', post.id);
    handleFetchComments(post.id);
    console.log('현재 comments 상태:', comments);
  };

  // 댓글 추가 시 postId 설정
  const handleAddCommentWithPostId = () => {
    console.log('=== 댓글 추가 시작 ===');
    console.log('selectedPost:', selectedPost);
    console.log('newComment:', newComment);

    if (selectedPost) {
      console.log('postId 설정:', selectedPost.id);
      // userId를 보존하면서 postId만 업데이트
      const updatedComment = {
        ...newComment,
        postId: selectedPost.id,
        userId: newComment.userId || 1, // userId가 없으면 기본값 1 사용
      };
      console.log('업데이트된 댓글:', updatedComment);

      // setNewComment 완료 후 댓글 추가 함수 호출
      setNewComment(updatedComment);

      // 상태 업데이트가 완료된 후 댓글 추가 실행
      // useCallback을 사용하여 updatedComment를 클로저로 캡처
      const addCommentWithUpdatedData = () => {
        console.log('댓글 추가 함수 호출, updatedComment:', updatedComment);
        // updatedComment를 직접 사용하여 API 호출
        handleAddCommentWithData(updatedComment);
      };

      // 다음 렌더링 사이클에서 실행
      setTimeout(addCommentWithUpdatedData, 0);
    } else {
      console.error('selectedPost가 없습니다!');
    }
  };

  // 특정 데이터로 댓글 추가하는 함수
  const handleAddCommentWithData = async (commentData: any) => {
    console.log('handleAddCommentWithData 호출:', commentData);

    try {
      const response = await fetch('/api/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 에러 응답:', errorText);
        throw new Error(`API 호출 실패: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('댓글 추가 성공:', data);

      // 댓글 상태 업데이트 (useCommentFeature에서 가져온 함수들 사용)
      const updatedComments = {
        ...comments,
        [data.postId]: [...(comments[data.postId] || []), data],
      };

      setComments(updatedComments);
      setShowAddCommentDialog(false);
      setNewComment({ body: '', postId: null, userId: 1 });
    } catch (error) {
      console.error('댓글 추가 오류:', error);
    }
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
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              placeholder='제목'
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={30}
              placeholder='내용'
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Input
              type='number'
              placeholder='사용자 ID'
              value={newPost.userId}
              onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            />
            <Button onClick={handleAddPost}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              placeholder='제목'
              value={selectedPost?.title || ''}
              onChange={(e) => {
                if (selectedPost) setSelectedPost({ ...selectedPost, title: e.target.value });
              }}
            />
            <Textarea
              rows={15}
              placeholder='내용'
              value={selectedPost?.body || ''}
              onChange={(e) => {
                if (selectedPost) setSelectedPost({ ...selectedPost, body: e.target.value });
              }}
            />
            <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Textarea
              placeholder='댓글 내용'
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />
            <Button onClick={handleAddCommentWithPostId}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Textarea
              placeholder='댓글 내용'
              value={selectedComment?.body || ''}
              onChange={(e) => {
                if (selectedComment) {
                  setSelectedComment({ ...selectedComment, body: e.target.value });
                }
              }}
            />
            <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>
              {selectedPost?.title && selectedPost.title.trim()
                ? highlightText(selectedPost.title, searchQuery)
                : '게시물 상세 보기'}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>{highlightText(selectedPost?.body || '', searchQuery)}</p>
            {selectedPost && (
              <Comments
                postId={selectedPost.id}
                comments={comments}
                searchQuery={searchQuery}
                setNewComment={setNewComment}
                setShowAddCommentDialog={setShowAddCommentDialog}
                setSelectedComment={setSelectedComment}
                setShowEditCommentDialog={setShowEditCommentDialog}
                handleLikeComment={handleLikeComment}
                handleDeleteComment={handleDeleteComment}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <img
              src={user?.image}
              alt={user?.username}
              className='w-24 h-24 rounded-full mx-auto'
            />
            <h3 className='text-xl font-semibold text-center'>{user?.username}</h3>
            <div className='space-y-2'>
              <p>
                <strong>이름:</strong> {user?.firstName} {user?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {user?.age}
              </p>
              <p>
                <strong>이메일:</strong> {user?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {user?.phone}
              </p>
              <p>
                <strong>주소:</strong> {user?.address?.address}, {user?.address?.city},{' '}
                {user?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {user?.company?.name} - {user?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PostsManager;
