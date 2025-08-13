/**
 * 게시물 관리 페이지 (메인 기능 컴포넌트)
 *
 * 역할:
 * - 게시물과 댓글의 전체 CRUD 기능을 관리하는 중앙 컨트롤러 컴포넌트
 * - 사용자 인터페이스와 데이터 관리를 통합하여 관리자 대시보드 기능 제공
 * - URL 기반 상태 동기화와 다양한 필터링/검색 기능 제공
 *
 * 주요 기능:
 * 1. 게시물 관리: 조회, 생성, 수정, 삭제, 검색, 태그별 필터링
 * 2. 댓글 관리: 조회, 생성, 수정, 삭제, 좋아요
 * 3. 사용자 정보: 작성자 정보 모달 표시
 * 4. 페이지네이션: 데이터 분할 로딩과 네비게이션
 * 5. 실시간 검색: 제목/내용 기반 텍스트 검색
 * 6. 정렬 기능: ID, 제목, 반응 수 기준 오름차순/내림차순
 * 7. URL 동기화: 브라우저 히스토리와 상태 동기화
 *
 * 로직 구조:
 * - 18개의 useState를 통한 복합 상태 관리
 * - useEffect를 통한 라이프사이클 및 사이드 이펙트 처리
 * - Fetch API 기반 비동기 데이터 통신
 * - 조건부 렌더링을 통한 동적 UI 표시
 *
 * 문제점:
 * - 단일 책임 원칙 위반 (815줄의 거대한 컴포넌트)
 * - 관심사 분리 부족 (UI, 비즈니스 로직, API 호출 혼재)
 * - 상태 관리 복잡성 (18개의 useState)
 */
import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import {
  Edit2,
  MessageSquare,
  Plus,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';

import { API_CONSTANTS, UI_CONSTANTS } from '@/shared/constants';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '@/shared/ui';

const PostsManager = () => {
  // ==================== 라우팅 및 URL 관리 ====================
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // ==================== 게시물 관련 상태 ====================
  const [posts, setPosts] = useState([]); // 게시물 목록 데이터
  const [total, setTotal] = useState(API_CONSTANTS.REACTIONS.DEFAULT_LIKES); // 전체 게시물 수 (페이지네이션용)
  const [selectedPost, setSelectedPost] = useState(null); // 현재 선택된 게시물
  const [newPost, setNewPost] = useState({
    title: '',
    body: '',
    userId: API_CONSTANTS.DEFAULT_USER_ID,
  }); // 새 게시물 임시 데이터

  // ==================== 페이지네이션 상태 ====================
  const [skip, setSkip] = useState(
    parseInt(
      queryParams.get('skip') || String(UI_CONSTANTS.PAGINATION.DEFAULT_SKIP)
    )
  ); // 건너뛸 데이터 수
  const [limit, setLimit] = useState(
    parseInt(
      queryParams.get('limit') || String(UI_CONSTANTS.PAGINATION.DEFAULT_LIMIT)
    )
  ); // 페이지당 표시할 데이터 수

  // ==================== 검색 및 필터링 상태 ====================
  const [searchQuery, setSearchQuery] = useState(
    queryParams.get('search') || ''
  ); // 검색어
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || ''); // 정렬 기준
  const [sortOrder, setSortOrder] = useState(
    queryParams.get('sortOrder') || 'asc'
  ); // 정렬 순서
  const [tags, setTags] = useState([]); // 사용 가능한 태그 목록
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || ''); // 선택된 태그

  // ==================== 댓글 관련 상태 ====================
  const [comments, setComments] = useState({}); // 게시물별 댓글 캐시 {postId: comments[]}
  const [selectedComment, setSelectedComment] = useState(null); // 현재 선택된 댓글
  const [newComment, setNewComment] = useState({
    body: '',
    postId: null,
    userId: API_CONSTANTS.DEFAULT_USER_ID,
  }); // 새 댓글 임시 데이터

  // ==================== UI 다이얼로그 상태 ====================
  const [showAddDialog, setShowAddDialog] = useState(false); // 게시물 추가 모달
  const [showEditDialog, setShowEditDialog] = useState(false); // 게시물 수정 모달
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false); // 댓글 추가 모달
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false); // 댓글 수정 모달
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false); // 게시물 상세 모달
  const [showUserModal, setShowUserModal] = useState(false); // 사용자 정보 모달

  // ==================== 기타 상태 ====================
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자 정보

  // ==================== URL 동기화 함수 ====================
  /**
   * 현재 상태를 URL 쿼리 파라미터에 반영
   * - 브라우저 히스토리 관리로 뒤로가기/앞으로가기 지원
   * - 페이지 새로고침 시 상태 복원 가능
   * - 링크 공유를 통한 상태 전달 가능
   */
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

  // ==================== 게시물 데이터 관리 함수들 ====================
  /**
   * 게시물 목록 조회 (작성자 정보 포함)
   * 로직:
   * 1. 페이지네이션 파라미터로 게시물 API 호출
   * 2. 별도로 사용자 목록 API 호출 (작성자 정보용)
   * 3. 게시물과 사용자 데이터를 매핑하여 author 필드 추가
   * 4. 상태 업데이트 및 로딩 상태 관리
   */
  const fetchPosts = () => {
    setLoading(true);
    let postsData;
    let usersData;

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then(response => response.json())
      .then(data => {
        postsData = data;
        return fetch(
          `${API_CONSTANTS.ENDPOINTS.USERS}?limit=0&select=username,image`
        );
      })
      .then(response => response.json())
      .then(users => {
        usersData = users.users;
        const postsWithUsers = postsData.posts.map(post => ({
          ...post,
          author: usersData.find(user => user.id === post.userId),
        }));
        setPosts(postsWithUsers);
        setTotal(postsData.total);
      })
      .catch(error => {
        console.error('게시물 가져오기 오류:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * 사용 가능한 태그 목록 조회
   * - 필터링 옵션으로 사용될 태그들을 미리 로드
   */
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/posts/tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('태그 가져오기 오류:', error);
    }
  };

  /**
   * 게시물 텍스트 검색
   * - 검색어가 있으면 검색 API 호출, 없으면 일반 목록 조회
   * - 검색 결과도 게시물 목록과 동일한 형태로 처리
   */
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

  /**
   * 태그별 게시물 필터링
   * - 특정 태그에 속한 게시물들만 조회
   * - Promise.all을 사용한 병렬 API 호출로 성능 최적화
   * - 작성자 정보 매핑 로직 공통 적용
   */
  const fetchPostsByTag = async tag => {
    if (!tag || tag === 'all') {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch(`${API_CONSTANTS.ENDPOINTS.USERS}?limit=0&select=username,image`),
      ]);
      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();

      const postsWithUsers = postsData.posts.map(post => ({
        ...post,
        author: usersData.users.find(user => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error('태그별 게시물 가져오기 오류:', error);
    }
    setLoading(false);
  };

  // ==================== 게시물 CRUD 함수들 ====================
  /**
   * 새 게시물 생성
   * - 낙관적 업데이트: API 호출 후 즉시 로컬 상태 업데이트
   * - 폼 초기화 및 다이얼로그 닫기 처리
   */
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
      setNewPost({
        title: '',
        body: '',
        userId: API_CONSTANTS.DEFAULT_USER_ID,
      });
    } catch (error) {
      console.error('게시물 추가 오류:', error);
    }
  };

  /**
   * 기존 게시물 수정
   * - 선택된 게시물의 데이터를 서버에 전송
   * - 응답받은 데이터로 로컬 상태의 해당 게시물 교체
   */
  const updatePost = async () => {
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPost),
      });
      const data = await response.json();
      setPosts(posts.map(post => (post.id === data.id ? data : post)));
      setShowEditDialog(false);
    } catch (error) {
      console.error('게시물 업데이트 오류:', error);
    }
  };

  /**
   * 게시물 삭제
   * - 서버에서 삭제 후 로컬 상태에서도 해당 게시물 제거
   * - filter를 사용한 불변성 유지
   */
  const deletePost = async id => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };

  // ==================== 댓글 관리 함수들 ====================
  /**
   * 특정 게시물의 댓글 조회
   * - 캐싱 메커니즘: 이미 로드된 댓글은 재요청하지 않음
   * - 게시물별로 댓글을 객체 형태로 저장 {postId: comments[]}
   */
  const fetchComments = async postId => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      const data = await response.json();
      setComments(prev => ({ ...prev, [postId]: data.comments }));
    } catch (error) {
      console.error('댓글 가져오기 오류:', error);
    }
  };

  /**
   * 새 댓글 생성
   * - 해당 게시물의 댓글 배열에 새 댓글 추가
   * - 기존 댓글이 없는 경우 빈 배열로 초기화 후 추가
   */
  const addComment = async () => {
    try {
      const response = await fetch('/api/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      const data = await response.json();
      setComments(prev => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }));
      setShowAddCommentDialog(false);
      setNewComment({
        body: '',
        postId: null,
        userId: API_CONSTANTS.DEFAULT_USER_ID,
      });
    } catch (error) {
      console.error('댓글 추가 오류:', error);
    }
  };

  /**
   * 기존 댓글 수정
   * - 댓글 내용만 수정 가능 (body 필드)
   * - 해당 게시물의 댓글 배열에서 수정된 댓글 교체
   */
  const updateComment = async () => {
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: selectedComment.body }),
      });
      const data = await response.json();
      setComments(prev => ({
        ...prev,
        [data.postId]: prev[data.postId].map(comment =>
          comment.id === data.id ? data : comment
        ),
      }));
      setShowEditCommentDialog(false);
    } catch (error) {
      console.error('댓글 업데이트 오류:', error);
    }
  };

  /**
   * 댓글 삭제
   * - 해당 게시물의 댓글 배열에서 삭제된 댓글 제거
   * - filter를 사용한 불변성 유지
   */
  const deleteComment = async (id, postId) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].filter(comment => comment.id !== id),
      }));
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  /**
   * 댓글 좋아요 기능
   * - 현재 좋아요 수에서 +1 증가
   * - 낙관적 업데이트로 즉시 UI 반영
   */
  const likeComment = async (id, postId) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likes:
            comments[postId].find(c => c.id === id).likes +
            API_CONSTANTS.REACTIONS.LIKE_INCREMENT,
        }),
      });
      const data = await response.json();
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].map(comment =>
          comment.id === data.id
            ? {
                ...data,
                likes: comment.likes + API_CONSTANTS.REACTIONS.LIKE_INCREMENT,
              }
            : comment
        ),
      }));
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  // ==================== UI 인터랙션 함수들 ====================
  /**
   * 게시물 상세 모달 열기
   * - 선택된 게시물 설정
   * - 해당 게시물의 댓글 로드 (캐싱 적용)
   * - 상세 다이얼로그 표시
   */
  const openPostDetail = post => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  /**
   * 사용자 정보 모달 열기
   * - 작성자 클릭 시 해당 사용자의 상세 정보 조회
   * - 추가 사용자 정보 (연락처, 주소, 직장 등) 표시
   */
  const openUserModal = async user => {
    try {
      const response = await fetch(`/api/users/${user.id}`);
      const userData = await response.json();
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    }
  };

  // ==================== 라이프사이클 및 사이드 이펙트 ====================
  /**
   * 컴포넌트 마운트 시 태그 목록 초기화
   */
  useEffect(() => {
    fetchTags();
  }, []);

  /**
   * 페이지네이션, 정렬, 태그 변경 시 데이터 재조회
   * - 태그가 선택된 경우: 태그별 게시물 조회
   * - 태그가 없는 경우: 일반 게시물 목록 조회
   * - URL 상태 동기화
   */
  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  /**
   * URL 변경 시 상태 동기화
   * - 브라우저 뒤로가기/앞으로가기 대응
   * - 직접 URL 접근 시 상태 복원
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(
      parseInt(
        params.get('skip') || String(UI_CONSTANTS.PAGINATION.DEFAULT_SKIP)
      )
    );
    setLimit(
      parseInt(
        params.get('limit') || String(UI_CONSTANTS.PAGINATION.DEFAULT_LIMIT)
      )
    );
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || 'asc');
    setSelectedTag(params.get('tag') || '');
  }, [location.search]);

  // ==================== 유틸리티 함수들 ====================
  /**
   * 검색어 하이라이트 기능
   * - 검색어가 포함된 텍스트를 시각적으로 강조 표시
   * - 정규표현식을 사용한 대소문자 무시 검색
   * - 검색어가 없거나 텍스트가 없는 경우 예외 처리
   */
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
          regex.test(part) ? (
            <mark key={i}>{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  // ==================== 렌더링 함수들 ====================
  /**
   * 게시물 테이블 렌더링
   * - 게시물 목록을 테이블 형태로 표시
   * - 각 행에 게시물 정보, 작성자, 반응, 액션 버튼 포함
   * - 검색어 하이라이트 적용
   * - 태그 클릭으로 필터링 기능
   */
  const renderPostTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[50px]'>ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className='w-[150px]'>작성자</TableHead>
          <TableHead className='w-[150px]'>반응</TableHead>
          <TableHead className='w-[150px]'>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map(post => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className='space-y-1'>
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className='flex flex-wrap gap-1'>
                  {post.tags?.map(tag => (
                    <span
                      key={tag}
                      className={`${UI_CONSTANTS.STYLES.TAG_SIZE} ${
                        selectedTag === tag
                          ? UI_CONSTANTS.STYLES.TAG_SELECTED
                          : UI_CONSTANTS.STYLES.TAG_DEFAULT
                      }`}
                      onClick={() => {
                        setSelectedTag(tag);
                        updateURL();
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className='flex items-center space-x-2 cursor-pointer'
                onClick={() => openUserModal(post.author)}
              >
                <img
                  src={post.author?.image}
                  alt={post.author?.username}
                  className={`${UI_CONSTANTS.ICON_SIZES.LARGE} rounded-full`}
                />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <ThumbsUp className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                <span>
                  {post.reactions?.likes ||
                    API_CONSTANTS.REACTIONS.DEFAULT_LIKES}
                </span>
                <ThumbsDown className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                <span>
                  {post.reactions?.dislikes ||
                    API_CONSTANTS.REACTIONS.DEFAULT_DISLIKES}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => openPostDetail(post)}
                >
                  <MessageSquare className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setSelectedPost(post);
                    setShowEditDialog(true);
                  }}
                >
                  <Edit2 className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => deletePost(post.id)}
                >
                  <Trash2 className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  /**
   * 댓글 목록 렌더링
   * - 특정 게시물의 댓글들을 표시
   * - 댓글 추가, 수정, 삭제, 좋아요 기능 포함
   * - 검색어 하이라이트 적용
   * - 작성자명과 댓글 내용 표시
   */
  const renderComments = postId => (
    <div className='mt-2'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-sm font-semibold'>댓글</h3>
        <Button
          size='sm'
          onClick={() => {
            setNewComment(prev => ({ ...prev, postId }));
            setShowAddCommentDialog(true);
          }}
        >
          <Plus className={`${UI_CONSTANTS.ICON_SIZES.SMALL} mr-1`} />
          댓글 추가
        </Button>
      </div>
      <div className='space-y-1'>
        {comments[postId]?.map(comment => (
          <div
            key={comment.id}
            className='flex items-center justify-between text-sm border-b pb-1'
          >
            <div className='flex items-center space-x-2 overflow-hidden'>
              <span className='font-medium truncate'>
                {comment.user.username}:
              </span>
              <span className='truncate'>
                {highlightText(comment.body, searchQuery)}
              </span>
            </div>
            <div className='flex items-center space-x-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => likeComment(comment.id, postId)}
              >
                <ThumbsUp className={UI_CONSTANTS.ICON_SIZES.SMALL} />
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
                <Edit2 className={UI_CONSTANTS.ICON_SIZES.SMALL} />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => deleteComment(comment.id, postId)}
              >
                <Trash2 className={UI_CONSTANTS.ICON_SIZES.SMALL} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className={`${UI_CONSTANTS.ICON_SIZES.MEDIUM} mr-2`} />
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
                <Search
                  className={`absolute left-2 top-2.5 ${UI_CONSTANTS.ICON_SIZES.MEDIUM} text-muted-foreground`}
                />
                <Input
                  placeholder='게시물 검색...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && searchPosts()}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={value => {
                setSelectedTag(value);
                fetchPostsByTag(value);
                updateURL();
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='태그 선택' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>모든 태그</SelectItem>
                {tags.map(tag => (
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
            renderPostTable()
          )}

          {/* 페이지네이션 */}
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <span>표시</span>
              <Select
                value={limit.toString()}
                onValueChange={value => setLimit(Number(value))}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='10' />
                </SelectTrigger>
                <SelectContent>
                  {UI_CONSTANTS.PAGINATION.LIMIT_OPTIONS.map(option => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className='flex gap-2'>
              <Button
                disabled={skip === UI_CONSTANTS.PAGINATION.DEFAULT_SKIP}
                onClick={() =>
                  setSkip(
                    Math.max(UI_CONSTANTS.PAGINATION.DEFAULT_SKIP, skip - limit)
                  )
                }
              >
                이전
              </Button>
              <Button
                disabled={skip + limit >= total}
                onClick={() => setSkip(skip + limit)}
              >
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
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={UI_CONSTANTS.TEXTAREA_ROWS.LARGE}
              placeholder='내용'
              value={newPost.body}
              onChange={e => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Input
              type='number'
              placeholder='사용자 ID'
              value={newPost.userId}
              onChange={e =>
                setNewPost({ ...newPost, userId: Number(e.target.value) })
              }
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
              onChange={e =>
                setSelectedPost({ ...selectedPost, title: e.target.value })
              }
            />
            <Textarea
              rows={UI_CONSTANTS.TEXTAREA_ROWS.MEDIUM}
              placeholder='내용'
              value={selectedPost?.body || ''}
              onChange={e =>
                setSelectedPost({ ...selectedPost, body: e.target.value })
              }
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Textarea
              placeholder='댓글 내용'
              value={newComment.body}
              onChange={e =>
                setNewComment({ ...newComment, body: e.target.value })
              }
            />
            <Button onClick={addComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Textarea
              placeholder='댓글 내용'
              value={selectedComment?.body || ''}
              onChange={e =>
                setSelectedComment({ ...selectedComment, body: e.target.value })
              }
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
      >
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>
              {highlightText(selectedPost?.title, searchQuery)}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>{highlightText(selectedPost?.body, searchQuery)}</p>
            {renderComments(selectedPost?.id)}
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
            <h3 className='text-xl font-semibold text-center'>
              {selectedUser?.username}
            </h3>
            <div className='space-y-2'>
              <p>
                <strong>이름:</strong> {selectedUser?.firstName}{' '}
                {selectedUser?.lastName}
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
