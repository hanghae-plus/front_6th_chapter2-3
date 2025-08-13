# 📈 진행 상황

## ✅ Phase 1: 개발 환경 설정

### 1) eslint, prettier 설정

#### 요구사항

- @ 그룹 내에서 FSD 순서 유지
- 폴더구조상으론 레이어 계층을 이해하기 위해 1_app, 2_pages으로 폴더를 만들었지만 절대 경로 상으론 `@/app`, `@/pages`로 사용
- `@/widgets`, `@/widgets/Component` 모두 사용 가능 (index 파일 + 개별 파일 접근)
- 외부 라이브러리, 내부 라이브러리, 타입 임포트 문끼리 그룹화
- scoped package(@로 시작하는 외부 라이브러리) 별도 그룹화

#### **Import 정렬 설정**

- `@trivago/prettier-plugin-sort-imports` 플러그인 설정
- Import 순서: React → 외부 라이브러리 → scoped 외부 라이브러리 → FSD 내부 라이브러리 → 상대경로 → 타입
- 그룹 간 자동 공백 추가 (`importOrderSeparation: true`)
- scoped package 예외 처리: `^@(?!(app|pages|widgets|features|entities|shared)/)`

#### **Path Alias 설정**

- TypeScript: `tsconfig.app.json`에 index 파일 및 와일드카드 매핑
- ESLint: `import/resolver`에 index 파일 + 와일드카드 경로 설정
- Vite: `vite.config.ts`에 index 파일 + 와일드카드 alias 설정

#### **현재 Import 순서**

```typescript
// 1. React 생태계
import React from 'react';
import ReactDOM from 'react-dom';

// 2. 외부 라이브러리 (일반)
import axios from 'axios';
import lodash from 'lodash';

// 3. 외부 라이브러리 (scoped packages)
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

// 4. FSD 내부 라이브러리 (index 파일 접근)
import { App } from '@/app';
import { PostsManagerPage } from '@/pages';
import { Header, Footer } from '@/widgets';
import { LoginForm } from '@/features';
import { User } from '@/entities';
import { Button } from '@/shared';

// 5. 상대 경로
import { Component } from '../Component';
import './App.css';

// 6. 타입 Import
import type { User } from '@/entities/User';
import type { Props } from './types';
```

## ✅ Phase 2: FSD 아키텍처 적용

### 1) 디렉토리 구조 변경

#### **레이어별 디렉토리 구성**

- `src/1_app/` - 애플리케이션 레이어 (App.tsx)
- `src/2_pages/` - 페이지 레이어 (PostsManagerPage.tsx)
- `src/3_widgets/` - 위젯 레이어 (Header.tsx, Footer.tsx)
- `src/4_features/` - 기능 레이어 (준비됨)
- `src/5_entities/` - 엔티티 레이어 (준비됨)
- `src/6_shared/` - 공유 레이어 (준비됨)

#### **파일 이동 및 정리**

- `src/App.tsx` → `src/1_app/App.tsx`
- `src/pages/PostsManagerPage.tsx` → `src/2_pages/PostsManagerPage.tsx`
- `src/components/Header.tsx` → `src/3_widgets/Header.tsx`
- `src/components/Footer.tsx` → `src/3_widgets/Footer.tsx`

#### **Public API 설정**

- 모든 FSD 레이어에 index.ts 파일 생성
- 각 레이어의 public API를 통한 import/export
- 지원되는 경로 패턴:
  - `@/widgets` → `src/3_widgets/index.ts`
  - `@/widgets/*` → `src/3_widgets/*` (개별 파일 접근)

#### **설정된 절대 경로**

```typescript
// Index 파일 접근
'@/app'      → 'src/1_app/index.ts'
'@/pages'    → 'src/2_pages/index.ts'
'@/widgets'  → 'src/3_widgets/index.ts'
'@/features' → 'src/4_features/index.ts'
'@/entities' → 'src/5_entities/index.ts'
'@/shared'   → 'src/6_shared/index.ts'

// 개별 파일 접근
'@/widgets/*' → 'src/3_widgets/*'
'@/shared/*'  → 'src/6_shared/*'
'@/*'         → 'src/*' (루트 접근)
```

#### 🎯 **현재 상태**

- **Path Alias**: TypeScript, ESLint, Vite 모든 환경에서 정상 동작
- **Index 파일**: 모든 FSD 레이어에 public API 구성 완료
- **Import Order**: 6단계 그룹화 자동 정렬 적용
- **Staged**: FSD 구조 변경 및 설정 파일들 준비 완료

## ✅ Phase 3: 클린 코드 리팩토링

### 1) 매직넘버 상수화

#### **상수 관리 구조 구축**

FSD 아키텍처에 따라 `6_shared/constants/` 디렉토리에 상수 관리 시스템 구축:

```typescript
src/6_shared/constants/
├── ui.ts          # UI 관련 상수 (크기, 스타일, 레이아웃)
├── api.ts         # API 관련 상수 (엔드포인트, 기본값)
└── index.ts       # 배럴 파일 (통합 export)
```

#### **UI 상수 정의**

```typescript
// src/6_shared/constants/ui.ts
export const UI_CONSTANTS = {
  TEXTAREA_ROWS: {
    LARGE: 30, // 게시물 작성용
    MEDIUM: 15, // 게시물 수정용
    SMALL: 5, // 댓글 작성용
  },
  ICON_SIZES: {
    SMALL: 'w-3 h-3', // 댓글 버튼용
    MEDIUM: 'w-4 h-4', // 일반 버튼용
    LARGE: 'w-8 h-8', // 프로필 이미지용
  },
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    DEFAULT_SKIP: 0,
    LIMIT_OPTIONS: [10, 20, 30] as const,
  },
  STYLES: {
    TAG_SELECTED: 'text-white bg-blue-500 hover:bg-blue-600',
    TAG_DEFAULT: 'text-blue-800 bg-blue-100 hover:bg-blue-200',
    TAG_SIZE: 'px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer',
  },
} as const;
```

#### **API 상수 정의**

```typescript
// src/6_shared/constants/api.ts
export const API_CONSTANTS = {
  ENDPOINTS: {
    POSTS: '/api/posts',
    USERS: '/api/users',
    COMMENTS: '/api/comments',
  },
  DEFAULT_USER_ID: 1,
  QUERY_PARAMS: {
    USERS_SELECT: 'limit=0&select=username,image',
  },
  REACTIONS: {
    DEFAULT_LIKES: 0,
    DEFAULT_DISLIKES: 0,
    LIKE_INCREMENT: 1,
  },
} as const;
```

#### **PostsManagerPage 리팩토링**

매직넘버 → 상수 교체 완료:

**UI 관련 매직넘버**:

- ✅ `rows={30}` → `rows={UI_CONSTANTS.TEXTAREA_ROWS.LARGE}`
- ✅ `rows={15}` → `rows={UI_CONSTANTS.TEXTAREA_ROWS.MEDIUM}`
- ✅ `className='w-4 h-4'` → `className={UI_CONSTANTS.ICON_SIZES.MEDIUM}`
- ✅ `className='w-3 h-3'` → `className={UI_CONSTANTS.ICON_SIZES.SMALL}`
- ✅ `className='w-8 h-8'` → `className={UI_CONSTANTS.ICON_SIZES.LARGE}`
- ✅ 페이지네이션 `[10, 20, 30]` → `UI_CONSTANTS.PAGINATION.LIMIT_OPTIONS`
- ✅ 태그 스타일 인라인 클래스 → `UI_CONSTANTS.STYLES.*`

**API 관련 매직넘버**:

- ✅ `userId: 1` → `userId: API_CONSTANTS.DEFAULT_USER_ID`
- ✅ `likes + 1` → `likes + API_CONSTANTS.REACTIONS.LIKE_INCREMENT`
- ✅ `|| 0` → `|| API_CONSTANTS.REACTIONS.DEFAULT_LIKES`
- ✅ `parseInt('10')` → `parseInt(String(UI_CONSTANTS.PAGINATION.DEFAULT_LIMIT))`
- ✅ `parseInt('0')` → `parseInt(String(UI_CONSTANTS.PAGINATION.DEFAULT_SKIP))`

#### **Import 구문 추가**

```typescript
// src/2_pages/PostsManagerPage.tsx
import { API_CONSTANTS, UI_CONSTANTS } from '@/shared/constants';
```

#### **Public API 등록**

```typescript
// src/6_shared/index.ts
export * from './ui';
export * from './constants';
```

#### 🎯 **현재 상태**

- **상수 구조**: FSD 아키텍처 기반 체계적 상수 관리 시스템 구축
- **매직넘버 제거**: PostsManagerPage의 모든 매직넘버 상수화 완료
- **타입 안정성**: `as const` 어서션으로 타입 안정성 확보
- **유지보수성**: 의미 있는 이름으로 코드 가독성 향상
- **일관성**: UI 요소와 API 설정값의 중앙 집중식 관리

#### **다음 단계**

1. **타입 정의**: TypeScript 타입 에러 해결
2. **도메인별 상수**: Post, Comment, User 엔티티별 상수 분리
3. **기능별 상수**: 검색, 정렬, 필터링 관련 상수 세분화

### 2) api, api용 타입 등을 엔티티에 넣은 이유

> feature와 1:1 관계가 아니다

- 1:N 일 때가 더 많고 api의 포함관계는 변동성이 높다.

## ✅ Phase 4: TanStack Query 도입 및 서버상태관리

### 1) TanStack Query 기본 설정

#### 🎯 **커밋 944778b**: feat: tanstack query 설정

- TanStack Query 의존성 추가 (`@tanstack/react-query`)
- App.tsx에 QueryClient 및 QueryClientProvider 설정
- 기본 옵션 구성 (staleTime: 5분, retry: 1회)

### 2) FSD 엔티티 구조 구성

#### **엔티티별 디렉토리 구조**

FSD 아키텍처에 따라 `5_entities` 레이어에 도메인별 엔티티 구성:

- `post/`: post.api.ts, post.type.ts, post.constant.ts, post.model.ts, index.ts
- `user/`: user.api.ts, user.type.ts, user.constant.ts, user.model.ts, index.ts

#### **구현 내용**

- **Post 엔티티**: PostReactions, Post 인터페이스 및 getPosts API 함수
- **User 엔티티**: User 인터페이스 및 getUsers API 함수
- **공유 타입**: PaginationResponse, PaginationParams, Nullable, Undefinable 등

#### 🎯 **커밋 895e518**: refactor: FSD 엔티티 폴더 구조 구성 및 게시물 조회, 사용자조회 API 작성

- Post, User 엔티티 도메인별 구조 분리
- API 함수 및 타입 정의 분리
- 공유 타입 시스템 구축 (PaginationResponse, 유틸리티 타입)
- Public API 인덱스 파일 구성

### 3) React Query 훅 및 QueryKey 구조적 관리

#### **QueryKey 팩토리 패턴**

- `QUERY_DOMAINS`: posts, users, comments, tags 도메인 상수
- `QUERY_OPERATIONS`: list, detail, infinite, search, count 작업 상수
- 도메인별 QueryKey 팩토리 함수 구현 (postQueryKeys, userQueryKeys)

#### **복합 쿼리 훅**

- `useGetPostsWithAuthor`: useQueries를 활용한 Post+User 데이터 조합
- useMemo를 통한 데이터 조합 최적화
- 로딩/에러 상태 통합 관리

#### **QueryKey 구조적 관리의 장점**

1. **일관성**: 도메인별 통일된 QueryKey 패턴
2. **타입 안전성**: TypeScript 기반 QueryKey 타입 검증
3. **유지보수성**: 중앙 집중식 QueryKey 관리
4. **확장성**: 새로운 도메인/작업 추가 용이

#### 🎯 **커밋 ff5f870**: feat: useGetPostsWithAuthor 구현 및 queryKeys 구조 설계

- QueryKey 팩토리 패턴 설계 및 구현
- useQueries를 활용한 복합 쿼리 훅 구현
- useMemo를 통한 데이터 조합 최적화
- 구조적 QueryKey 관리 시스템 구축

#### **현재 상태**

- **서버상태관리**: TanStack Query 기반 서버상태관리 구축
- **FSD 아키텍처**: 엔티티별 API/타입/쿼리 분리 완료
- **QueryKey 관리**: 팩토리 패턴 기반 구조적 관리 시스템
- **복합 쿼리**: useQueries를 활용한 데이터 조합 로직 구현
- **타입 안전성**: TypeScript 기반 강타입 시스템 구축
