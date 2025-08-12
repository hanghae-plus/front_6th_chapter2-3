import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  useAddComment,
  useDeleteComment,
  useFetchComments,
  useLikeComment,
  useUpdateComment,
} from '@/entities/comment/api/commentApi';
import { CommentList } from '@/entities/comment/ui/CommentList';
import {
  useFetchPosts,
  useAddPost,
  useUpdatePost,
  useDeletePost,
  useFetchTags,
  useSearchPosts,
  useFetchPostsByTag,
} from '@/entities/post/api/postApi';
import { PostTable } from '@/entities/post/ui/PostTable';
import { useFetchAllUsers, useFetchUserById } from '@/entities/user/api/userApi';
import { usePostFilter } from '@/features/post-filter/model/usePostFilter';
import { PostFilter } from '@/features/post-filter/ui/PostFilter';
import { usePagination } from '@/features/post-pagination/model/usePagination';
import { Pagination } from '@/features/post-pagination/ui/Pagination';
import { usePostSearch } from '@/features/post-search/model/usePostSearch';
import { PostSearch } from '@/features/post-search/ui/PostSearch';
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
  Textarea,
  HighlightText,
} from '@/shared/ui';

export const PostManagerWidget = () => {
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);

  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 });
  const [newComment, setNewComment] = useState({ body: '', postId: null, userId: 1 });

  const { skip, limit, setSkip, setLimit } = usePagination();
  const { selectedTag, sortBy, sortOrder, setSelectedTag, setSortBy, setSortOrder } =
    usePostFilter();
  const { inputValue, setInputValue, searchQuery, handleSearch } = usePostSearch();

  const { data: tagsData } = useFetchTags();
  const { data: searchData } = useSearchPosts(searchQuery);
  const { data: tagData } = useFetchPostsByTag(selectedTag);
  const { data: postsData, isLoading: isLoadingPosts } = useFetchPosts(limit, skip);

  const finalData = searchData || tagData || postsData;
  const total = finalData?.total || 0;
  const tags = tagsData || [];

  const { mutate: addPost } = useAddPost();
  const { mutate: updatePost } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();

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

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post);
    setSelectedPostId(post.id);
    setShowPostDetailDialog(true);
  };

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
            <PostSearch
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSearch={handleSearch}
            />
            <PostFilter
              tags={tags}
              sortBy={sortBy}
              sortOrder={sortOrder}
              selectedTag={selectedTag}
              setSortBy={setSortBy}
              setSortOrder={setSortOrder}
              setSelectedTag={setSelectedTag}
            />
          </div>

          {/* 게시물 테이블 */}
          {isLoadingPosts ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTable
              posts={postsWithAuthors}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              openPostDetail={openPostDetail}
              openUserModal={openUserModal}
              setShowEditDialog={setShowEditDialog}
              setSelectedPost={setSelectedPost}
              deletePost={deletePost}
              setSelectedTag={setSelectedTag}
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
            <Button onClick={addPost}>게시물 추가</Button>
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
              onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
            />
            <Textarea
              rows={15}
              placeholder='내용'
              value={selectedPost?.body || ''}
              onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
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
            <Button onClick={addComment}>댓글 추가</Button>
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
              onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>
              <HighlightText text={selectedPost?.title} highlight={searchQuery} />
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>
              <HighlightText text={selectedPost?.body} highlight={searchQuery} />
            </p>
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
