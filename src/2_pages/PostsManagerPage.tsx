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
import { useState } from 'react';

import { useLocation } from 'react-router-dom';

import { Plus } from 'lucide-react';

import { AddCommentDialog } from '@/features/comment-management';
import { EditCommentFormDialog } from '@/features/comment-management/ui/EditCommentFormDialog';
import { Filters } from '@/features/filter-posts';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

const PostsManager = () => {
  // ==================== 라우팅 및 URL 관리 ====================
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // ==================== 게시물 관련 상태 ====================
  const [total, setTotal] = useState<number>(
    API_CONSTANTS.REACTIONS.DEFAULT_LIKES
  );

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

  // ======== 개선 =======
  const { setShowAddDialog } = useUIStore();

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
          <Filters />

          <PostTable />

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
