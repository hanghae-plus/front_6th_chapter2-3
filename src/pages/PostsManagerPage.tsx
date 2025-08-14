import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../shared/ui';
import { PostsTable } from '../widgets/postsTable/ui/PostsTable';
import { PostsFilter } from '../widgets/postsFilter/ui/PostsFilter';
import { PostsPagination } from '../widgets/postsPagination/ui/PostsPagination';
import { AddPostDialog } from '../features/posts/add-post/ui/AddPostDialog';
import { EditPostDialog } from '../features/posts/edit-post/ui/EditPostDialog';
import { AddCommentDialog } from '../features/comment/add-comment/ui/AddCommentDialog';
import { EditCommentDialog } from '../features/comment/update-comment/ui/EditCommentDialog';
import { CommentsList } from '../widgets/commentsList/ui/CommentsList';
import { UserModal } from '../features/user/view-user/ui/UserModal';
import { PostDetailDialog } from '../features/posts/view-post/ui/PostDetailDialog';
import { addPost as addPostAPI } from '../features/posts/add-post/api/api';
import { updatePost as updatePostAPI } from '../features/posts/edit-post/api/api';
import { deletePost as deletePostAPI } from '../features/posts/delete-post/api/api';
import { fetchPostComments, fetchUserDetail } from '../features/posts/view-post/api/api';

import { usePostsStore } from '../entities/post/model/store';
import { useTagsStore } from '../entities/tags/model/store';
import { useCommentStore } from '../entities/comment/model/store';
import { NewPost, NewComment } from './PostsManagerPage/types';
import { highlightText } from '../shared/utils/text';
import PostsHeader from '../widgets/postsHeader/ui/PostsHeader';

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // 상태 관리
  // const [posts, setPosts] = useState<any[]>([]);
  // const [total, setTotal] = useState(0);
  const {
    posts,
    total,
    loading,
    setPosts,
    setTotal,
    fetchPosts: fetchPostsFromStore,
  } = usePostsStore();
  const { tags, selectedTag, setSelectedTag, fetchTags: fetchTagsFromStore } = useTagsStore();
  const {
    comments,
    selectedComment,
    newComment,
    setCommentsForPost,
    setSelectedComment,
    setNewComment,
    addCommentToPost,
    updateCommentInPost,
    removeCommentFromPost,
  } = useCommentStore();

  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'));
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'));
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState(queryParams.get('sortOrder') || 'asc');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newPost, setNewPost] = useState<NewPost>({ title: '', body: '', userId: 1 });
  // const [loading, setLoading] = useState(false);
  // const [tags, setTags] = useState<any[]>([]); // → useTagsStore로 대체
  // const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || ''); // → useTagsStore로 대체
  // const [comments, setComments] = useState<Record<number, any[]>>({}); // → useCommentStore로 대체
  // const [selectedComment, setSelectedComment] = useState<any | null>(null); // → useCommentStore로 대체
  // const [newComment, setNewComment] = useState<NewComment>({ body: '', postId: null, userId: 1 }); // → useCommentStore로 대체
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set('skip', skip.toString());
    if (limit) params.set('limit', limit.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);
    navigate(`?${params.toString()}`);
  };

  // 게시물 가져오기 (store의 fetchPosts를 사용하도록 변경 필요)
  const fetchPosts = () => {
    fetchPostsFromStore(limit, skip.toString());
  };

  // 태그 가져오기는 이제 useTagsStore에서 처리
  // const fetchTags = async () => { ... } // → useTagsStore.fetchTags로 대체

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts();
      return;
    }
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`);
      const data = await response.json();
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('게시물 검색 오류:', error);
    }
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === 'all') {
      fetchPosts();
      return;
    }
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch('/api/users?limit=0&select=username,image'),
      ]);
      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();

      const postsWithUsers = postsData.posts.map((post: any) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error('태그별 게시물 가져오기 오류:', error);
    }
  };

  // 게시물 추가
  const addPost = async () => {
    try {
      const data = await addPostAPI(newPost);
      setPosts([data, ...posts]);
      setShowAddDialog(false);
      setNewPost({ title: '', body: '', userId: 1 });
    } catch (error) {
      console.error('게시물 추가 오류:', error);
    }
  };

  // 게시물 업데이트
  const updatePost = async () => {
    try {
      const data = await updatePostAPI(selectedPost);
      setPosts(posts.map((post) => (post.id === data.id ? data : post)));
      setShowEditDialog(false);
    } catch (error) {
      console.error('게시물 업데이트 오류:', error);
    }
  };

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await deletePostAPI(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const commentsData = await fetchPostComments(postId);
      setCommentsForPost(postId, commentsData);
    } catch (error) {
      console.error('댓글 가져오기 오류:', error);
    }
  };

  // 댓글 추가
  const addComment = async () => {
    try {
      const response = await fetch('/api/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      const data = await response.json();
      addCommentToPost(data.postId, data);
      setShowAddCommentDialog(false);
      setNewComment({ body: '', postId: null, userId: 1 });
    } catch (error) {
      console.error('댓글 추가 오류:', error);
    }
  };

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment) return;
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: selectedComment.body }),
      });
      const data = await response.json();
      updateCommentInPost(data.postId, selectedComment.id, data);
      setShowEditCommentDialog(false);
    } catch (error) {
      console.error('댓글 업데이트 오류:', error);
    }
  };

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });
      removeCommentFromPost(postId, id);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id);
      if (!currentComment) return;

      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: currentComment.likes + 1 }),
      });
      const data = await response.json();
      updateCommentInPost(postId, id, { ...data, likes: currentComment.likes + 1 });
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  // 게시물 상세 보기
  const openPostDetail = (post: any) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (user: any) => {
    try {
      const userData = await fetchUserDetail(user.id);
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchTagsFromStore();
    // URL에서 selectedTag 초기화
    const tagFromURL = queryParams.get('tag') || '';
    if (tagFromURL !== selectedTag) {
      setSelectedTag(tagFromURL);
    }
  }, []);

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || 'asc');
    const tagFromURL = params.get('tag') || '';
    setSelectedTag(tagFromURL);
  }, [location.search]);

  // 하이라이트 함수 추가
  // const highlightText = (text: string, highlight: string) => {
  //   if (!text) return null;
  //   if (!highlight.trim()) {
  //     return <span>{text}</span>;
  //   }
  //   const regex = new RegExp(`(${highlight})`, 'gi');
  //   const parts = text.split(regex);
  //   return (
  //     <span>
  //       {parts.map((part, i) =>
  //         regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
  //       )}
  //     </span>
  //   );
  // };

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <CommentsList
      postId={postId}
      comments={comments[postId] || []}
      searchQuery={searchQuery}
      highlightText={highlightText}
      onAddComment={(postId) => {
        setNewComment({ ...newComment, postId });
        setShowAddCommentDialog(true);
      }}
      onEditComment={(comment) => {
        setSelectedComment(comment);
        setShowEditCommentDialog(true);
      }}
      onDeleteComment={deleteComment}
      onLikeComment={likeComment}
    />
  );

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <PostsHeader />
      {/* <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className='w-4 h-4 mr-2' />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader> */}
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <PostsFilter
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            sortBy={sortBy}
            sortOrder={sortOrder}
            tags={tags}
            onSearchChange={setSearchQuery}
            onSearchSubmit={searchPosts}
            onTagChange={(value) => {
              setSelectedTag(value);
              fetchPostsByTag(value);
              updateURL();
            }}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              highlightText={highlightText}
              onTagClick={(tag) => {
                setSelectedTag(tag);
                updateURL();
              }}
              onUserClick={openUserModal}
              onPostDetail={openPostDetail}
              onEditPost={(post) => {
                setSelectedPost(post);
                setShowEditDialog(true);
              }}
              onDeletePost={deletePost}
            />
          )}

          {/* 페이지네이션 */}
          <PostsPagination
            skip={skip}
            limit={limit}
            total={total}
            onSkipChange={setSkip}
            onLimitChange={setLimit}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog newPost={newPost} onPostChange={setNewPost} onSubmit={addPost} />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog
        selectedPost={selectedPost}
        onPostChange={setSelectedPost}
        onSubmit={updatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        newComment={newComment}
        onCommentChange={setNewComment}
        onSubmit={addComment}
      />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog
        selectedComment={selectedComment}
        onCommentChange={setSelectedComment}
        onSubmit={updateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        selectedPost={selectedPost}
        searchQuery={searchQuery}
        highlightText={highlightText}
        renderComments={renderComments}
      />

      {/* 사용자 모달 */}
      <UserModal open={showUserModal} onOpenChange={setShowUserModal} selectedUser={selectedUser} />
    </Card>
  );
};

export default PostsManager;
