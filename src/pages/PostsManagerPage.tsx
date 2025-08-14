import { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2, ThumbsUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Input,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import { PostTable } from '@/features/(post)/list-posts';
import { usePosts } from '@/features/(post)/list-posts';
import { TagFilterSelect } from '@/features/(post)/filter-by-tag';
import { useTagFilter } from '@/features/(post)/filter-by-tag';
import { SearchInput } from '@/features/(post)/search-posts';
import { usePostSearch } from '@/features/(post)/search-posts';
import { PaginationControls } from '@/features/(post)/paginate-posts';
import { SortSelect } from '@/features/(post)/sort-posts';
import { usePostSort } from '@/features/(post)/sort-posts';
import { tagApi } from '@/entities/tag';
import type { Post } from '@/entities/post';
import type { Comment } from '@/entities/comment';
import type { User } from '@/entities/user';

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // 상태 관리
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'));
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'));
  const { searchQuery, setQuery } = usePostSearch(queryParams.get('search') || '');
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
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 });
  const [tags, setTags] = useState<string[]>([]);
  const { selectedTag, setTag: setSelectedTag } = useTagFilter(queryParams.get('tag') || '');
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [newComment, setNewComment] = useState<{
    body: string;
    postId: number | null;
    userId: number;
  }>({ body: '', postId: null, userId: 1 });
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
    const params = new URLSearchParams();
    if (skip) params.set('skip', skip.toString());
    if (limit) params.set('limit', limit.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);
    navigate(`?${params.toString()}`);
  };

  // 태그 가져오기 (slug 배열)
  const fetchTags = async () => {
    try {
      const data = await tagApi.getTags();
      const slugs = Array.isArray(data) ? data.map((t) => t.slug) : [];
      setTags(slugs);
    } catch (error) {
      console.error('태그 가져오기 오류:', error);
    }
  };

  // 게시물 추가
  const addPost = async () => {
    try {
      const response = await fetch('/api/posts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      await response.json();
      void refetch();
      setShowAddDialog(false);
      setNewPost({ title: '', body: '', userId: 1 });
    } catch (error) {
      console.error('게시물 추가 오류:', error);
    }
  };

  // 게시물 업데이트
  const updatePost = async () => {
    try {
      if (!selectedPost) return;
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPost),
      });
      await response.json();
      void refetch();
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
      void refetch();
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
      if (!selectedComment) return;
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: selectedComment.body }),
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
      const target = comments[postId]?.find((c) => c.id === id);
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: (target?.likes ?? 0) + 1 }),
      });
      const data = await response.json();
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: (comment.likes ?? 0) + 1 } : comment,
        ),
      }));
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
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
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag, searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
    setQuery(params.get('search') || '');
    setSortBy((params.get('sortBy') as any) || 'none');
    setSortOrder((params.get('sortOrder') as any) || 'asc');
    setSelectedTag(params.get('tag') || '');
  }, [location.search, setQuery, setSortBy, setSortOrder, setSelectedTag]);

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
      onEdit={(post) => {
        setSelectedPost(post);
        setShowEditDialog(true);
      }}
      onDelete={(postId) => deletePost(postId)}
    />
  );

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <div className='mt-2'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-sm font-semibold'>댓글</h3>
        <Button
          size='sm'
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }));
            setShowAddCommentDialog(true);
          }}
        >
          <Plus className='w-3 h-3 mr-1' />
          댓글 추가
        </Button>
      </div>
      <div className='space-y-1'>
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className='flex items-center justify-between text-sm border-b pb-1'>
            <div className='flex items-center space-x-2 overflow-hidden'>
              <span className='font-medium truncate'>{comment.user.username}:</span>
              <span className='truncate'>{highlightText(comment.body, searchQuery || '')}</span>
            </div>
            <div className='flex items-center space-x-1'>
              <Button variant='ghost' size='sm' onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className='w-3 h-3' />
                <span className='ml-1 text-xs'>{comment.likes}</span>
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setSelectedComment(comment);
                  setShowEditCommentDialog(true);
                }}
              >
                <Edit2 className='w-3 h-3' />
              </Button>
              <Button variant='ghost' size='sm' onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className='w-3 h-3' />
              </Button>
            </div>
          </div>
        ))}
      </div>
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
            onPrev={() => setSkip(Math.max(0, skip - limit))}
            onNext={() => setSkip(skip + limit)}
            onChangeLimit={(v) => setLimit(v)}
          />
        </div>
      </Card.Content>

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
              onChange={(e) => {
                if (!selectedPost) return;
                setSelectedPost({ ...selectedPost, title: e.target.value });
              }}
            />
            <Textarea
              rows={15}
              placeholder='내용'
              value={selectedPost?.body || ''}
              onChange={(e) => {
                if (!selectedPost) return;
                setSelectedPost({ ...selectedPost, body: e.target.value });
              }}
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
              onChange={(e) => {
                if (!selectedComment) return;
                setSelectedComment({ ...selectedComment, body: e.target.value });
              }}
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title || '', searchQuery || '')}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>{highlightText(selectedPost?.body || '', searchQuery || '')}</p>
            {selectedPost ? renderComments(selectedPost.id) : null}
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
  );
};

export default PostsManager;
