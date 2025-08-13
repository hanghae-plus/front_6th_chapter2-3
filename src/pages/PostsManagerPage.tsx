import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  AddPostFormContent,
  EditPostFormContent,
  AddCommentFormContent,
  EditCommentFormContent,
} from '../features/PostDialogs';
import PostsControls from '../features/PostsControls';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  SelectTrigger,
  SelectContent,
  SelectItem,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from '../shared/ui'; // 추가된 UI 컴포넌트들
import CommentsList from '../widgets/CommentsList';
import PostsTable from '../widgets/PostsTable';
// 선택 컴포넌트 (페이지네이션 전용)
export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

// 대화상자 컴포넌트
export const Dialog = DialogPrimitive.Root;

// FSD 분리된 컴포넌트

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // 상태 관리
  const [posts, setPosts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'));
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'));
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState(queryParams.get('sortOrder') || 'asc');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 });
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Array<{ slug: string; url: string }>>([]);
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || '');
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [newComment, setNewComment] = useState<{
    body: string;
    postId: number | null;
    userId: number;
  }>({ body: '', postId: null, userId: 1 });
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

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

  // 게시물 가져오기
  const fetchPosts = () => {
    setLoading(true);
    let postsData: any;
    let usersData: any;

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        postsData = data;
        return fetch('/api/users?limit=0&select=username,image');
      })
      .then((response) => response.json())
      .then((users) => {
        usersData = users.users;
        const postsWithUsers = postsData.posts.map((post: any) => ({
          ...post,
          author: usersData.find((user: any) => user.id === post.userId),
        }));
        setPosts(postsWithUsers);
        setTotal(postsData.total);
      })
      .catch((error) => {
        console.error('게시물 가져오기 오류:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/posts/tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('태그 가져오기 오류:', error);
    }
  };

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`);
      const data = await response.json();
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('게시물 검색 오류:', error);
    }
    setLoading(false);
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === 'all') {
      fetchPosts();
      return;
    }
    setLoading(true);
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
    setLoading(false);
  };

  // 게시물 추가
  const addPost = async () => {
    try {
      const response = await fetch('/api/posts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const data = await response.json();
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
      const response = await fetch(`/api/posts/${selectedPost!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPost!),
      });
      const data = await response.json();
      setPosts(posts.map((post) => (post.id === data.id ? data : post)));
      setShowEditDialog(false);
    } catch (error) {
      console.error('게시물 업데이트 오류:', error);
    }
  };

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      const data = await response.json();
      setComments((prev) => ({ ...prev, [postId]: data.comments }));
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
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }));
      setShowAddCommentDialog(false);
      setNewComment({ body: '', postId: null, userId: 1 });
    } catch (error) {
      console.error('댓글 추가 오류:', error);
    }
  };

  // 댓글 업데이트
  const updateComment = async () => {
    try {
      const response = await fetch(`/api/comments/${selectedComment!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: selectedComment!.body }),
      });
      const data = await response.json();
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) =>
          comment.id === data.id ? data : comment,
        ),
      }));
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
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }));
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: comments[postId].find((c) => c.id === id).likes + 1 }),
      });
      const data = await response.json();
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }));
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
      const response = await fetch(`/api/users/${user.id}`);
      const userData = await response.json();
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchTags();
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
    setSelectedTag(params.get('tag') || '');
  }, [location.search]);

  // 하이라이트 함수 추가
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null;
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
        )}
      </span>
    );
  };

  // FSD 위젯/피처 콜백
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    updateURL();
  };
  const handleOpenEditPost = (post: any) => {
    setSelectedPost(post);
    setShowEditDialog(true);
  };
  const renderComments = (postId: number) => (
    <CommentsList
      postId={postId}
      comments={comments}
      searchQuery={searchQuery}
      onAddClick={(pid) => {
        setNewComment((prev) => ({ ...prev, postId: pid }));
        setShowAddCommentDialog(true);
      }}
      onLike={likeComment}
      onEdit={(comment) => {
        setSelectedComment(comment);
        setShowEditCommentDialog(true);
      }}
      onDelete={deleteComment}
      highlightText={highlightText}
    />
  );

  return (
    <main className='flex-grow container mx-auto px-4 py-8'>
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
            {/* 검색 및 필터 컨트롤 - Feature */}
            <PostsControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchEnter={searchPosts}
              selectedTag={selectedTag}
              tags={tags as any}
              onTagChange={(value) => {
                setSelectedTag(value);
                fetchPostsByTag(value);
                updateURL();
              }}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />

            {/* 게시물 테이블 - Widget */}
            {loading ? (
              <div className='flex justify-center p-4'>로딩 중...</div>
            ) : (
              <PostsTable
                posts={posts}
                searchQuery={searchQuery}
                selectedTag={selectedTag}
                onTagClick={handleTagClick}
                onOpenPostDetail={openPostDetail}
                onEditPost={handleOpenEditPost}
                onDeletePost={deletePost}
                highlightText={highlightText}
                onAuthorClick={openUserModal}
              />
            )}

            {/* 페이지네이션 */}
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <span>표시</span>
                <Select
                  value={limit.toString()}
                  onValueChange={(value: string) => setLimit(Number(value))}
                >
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
            <AddPostFormContent newPost={newPost} setNewPost={setNewPost} onSubmit={addPost} />
          </DialogContent>
        </Dialog>

        {/* 게시물 수정 대화상자 */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>게시물 수정</DialogTitle>
            </DialogHeader>
            <EditPostFormContent
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              onSubmit={updatePost}
            />
          </DialogContent>
        </Dialog>

        {/* 댓글 추가 대화상자 */}
        <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 댓글 추가</DialogTitle>
            </DialogHeader>
            <AddCommentFormContent
              newComment={newComment}
              setNewComment={setNewComment}
              onSubmit={addComment}
            />
          </DialogContent>
        </Dialog>

        {/* 댓글 수정 대화상자 */}
        <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>댓글 수정</DialogTitle>
            </DialogHeader>
            <EditCommentFormContent
              selectedComment={selectedComment}
              setSelectedComment={setSelectedComment}
              onSubmit={updateComment}
            />
          </DialogContent>
        </Dialog>

        {/* 게시물 상세 보기 대화상자 */}
        <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
          <DialogContent className='max-w-3xl'>
            <DialogHeader>
              <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <p>{highlightText(selectedPost?.body, searchQuery)}</p>
              {selectedPost && renderComments(selectedPost.id)}
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
                src={selectedUser?.image}
                alt={selectedUser?.username}
                className='w-24 h-24 rounded-full mx-auto'
              />
              <h3 className='text-xl font-semibold text-center'>{selectedUser?.username}</h3>
              <div className='space-y-2'>
                <p>
                  <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
                </p>
                <p>
                  <strong>나이:</strong> {selectedUser?.age}
                </p>
                <p>
                  <strong>이메일:</strong> {selectedUser?.email}
                </p>
                <p>
                  <strong>전화번호:</strong> {selectedUser?.phone}
                </p>
                <p>
                  <strong>주소:</strong> {selectedUser?.address?.address},{' '}
                  {selectedUser?.address?.city}, {selectedUser?.address?.state}
                </p>
                <p>
                  <strong>직장:</strong> {selectedUser?.company?.name} -{' '}
                  {selectedUser?.company?.title}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </main>
  );
};

export default PostsManager;
