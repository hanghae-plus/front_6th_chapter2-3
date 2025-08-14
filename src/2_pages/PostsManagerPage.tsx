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

import { Plus, Search } from 'lucide-react';

import { AddCommentDialog } from '@/features/comment-management';
import { EditCommentFormDialog } from '@/features/comment-management/ui/EditCommentFormDialog';
import { SelectTag } from '@/features/filter-posts';
import { SelectSortBy, SelectSortOrder } from '@/features/filter-posts';
import { PostDetailDialog, PostTable } from '@/features/post-management';
import { AddPostFormDialog } from '@/features/post-management/ui/AddPostFormDialog';
import { EditPostFormDialog } from '@/features/post-management/ui/EditPostFormDialog';
import { UserProfileDialog } from '@/features/user-profile';
import { API_CONSTANTS, UI_CONSTANTS } from '@/shared/constants';
import { useUIStore } from '@/shared/lib/store/UIStore';
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
} from '@/shared/ui';

const PostsManager = () => {
  // ==================== 라우팅 및 URL 관리 ====================
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // ==================== 게시물 관련 상태 ====================
  const [total, setTotal] = useState<number>(
    API_CONSTANTS.REACTIONS.DEFAULT_LIKES
  ); // 전체 게시물 수 (페이지네이션용)
  const [selectedPost, setSelectedPost] = useState(null); // 현재 선택된 게시물

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
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || ''); // 선택된 태그

  // ==================== 댓글 관련 상태 ====================
  const [comments, setComments] = useState({}); // 게시물별 댓글 캐시 {postId: comments[]}
  const [selectedComment, setSelectedComment] = useState(null); // 현재 선택된 댓글
  const [newComment, setNewComment] = useState({
    body: '',
    postId: null,
    userId: API_CONSTANTS.DEFAULT_USER_ID,
  }); // 새 댓글 임시 데이터

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

  // ======== 개선 =======
  const {
    showUserModal,
    setShowAddDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowUserModal,
  } = useUIStore();

  // ==================== 라이프사이클 및 사이드 이펙트 ====================

  /**
   * 페이지네이션, 정렬, 태그 변경 시 데이터 재조회
   * - 태그가 선택된 경우: 태그별 게시물 조회
   * - 태그가 없는 경우: 일반 게시물 목록 조회
   * - URL 상태 동기화
   */
  useEffect(() => {
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
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setSearchQuery(e.currentTarget.value);
                    }
                  }}
                />
              </div>
            </div>
            <SelectTag updateURL={updateURL} />
            <SelectSortBy />
            <SelectSortOrder />
          </div>

          <PostTable updateURL={updateURL} />

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

      <AddPostFormDialog />
      <EditPostFormDialog />
      <AddCommentDialog />
      <EditCommentFormDialog />
      <PostDetailDialog />
      <UserProfileDialog />
    </Card>
  );
};

export default PostsManager;
