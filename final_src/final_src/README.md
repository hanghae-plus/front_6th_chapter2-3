# Post Management System - FSD Architecture

## 📁 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 기반으로 구성되어 있습니다.

```
final_src/
├── 1_app/                    # 애플리케이션 레이어 (최상위)
│   ├── App.tsx              # 메인 애플리케이션 컴포넌트
│   ├── index.ts             # Public API
│   └── providers/           # 애플리케이션 프로바이더
│       ├── AppProvider.tsx  # 전역 프로바이더 설정
│       └── index.ts
├── 2_pages/                 # 페이지 레이어
│   ├── PostsManagerPage.tsx # 게시물 관리 페이지
│   └── index.ts
├── 3_widgets/               # 위젯 레이어
│   ├── Header.tsx           # 애플리케이션 헤더
│   ├── Footer.tsx           # 애플리케이션 푸터
│   └── index.ts
├── 4_features/              # 기능 레이어
│   ├── comment-management/  # 댓글 관리 기능
│   ├── filter-posts/        # 게시물 필터링 기능
│   ├── post-management/     # 게시물 관리 기능
│   └── user-profile/        # 사용자 프로필 기능
├── 5_entities/              # 엔티티 레이어
│   ├── comment/             # 댓글 엔티티
│   ├── post/                # 게시물 엔티티
│   ├── tag/                 # 태그 엔티티
│   └── user/                # 사용자 엔티티
├── 6_shared/                # 공유 레이어 (최하위)
│   ├── api/                 # API 관련 설정
│   ├── assets/              # 정적 자산
│   ├── constants/           # 상수 정의
│   ├── lib/                 # 공통 라이브러리
│   ├── types/               # 공통 타입 정의
│   └── ui/                  # 공통 UI 컴포넌트
├── main.tsx                 # 애플리케이션 진입점
├── global.d.ts              # 전역 타입 정의
└── index.css                # 전역 스타일
```

## 🏗️ FSD 아키텍처 원칙

### 1. 레이어 의존성 규칙

- **상위 레이어는 하위 레이어를 import할 수 있음**
- **하위 레이어는 상위 레이어를 import할 수 없음**
- 예: `features`는 `pages`를 import할 수 없음

### 2. 각 레이어의 역할

#### 1_app (애플리케이션 레이어)

- 애플리케이션 초기화 및 설정
- 전역 프로바이더 설정 (React Query, Jotai, Router)
- 애플리케이션 레이아웃 구조

#### 2_pages (페이지 레이어)

- 라우팅 가능한 페이지 컴포넌트
- 위젯과 기능을 조합하여 완전한 페이지 구성
- 비즈니스 로직은 포함하지 않음

#### 3_widgets (위젯 레이어)

- 독립적인 UI 블록
- 여러 기능을 조합한 복합 컴포넌트
- 재사용 가능한 레이아웃 요소

#### 4_features (기능 레이어)

- 사용자 행동과 관련된 기능
- 비즈니스 로직과 UI 로직 포함
- 특정 도메인에 종속된 기능

#### 5_entities (엔티티 레이어)

- 비즈니스 엔티티 정의
- API 통신, 데이터 모델, 타입 정의
- 도메인 로직 포함

#### 6_shared (공유 레이어)

- 애플리케이션 전체에서 공통으로 사용되는 코드
- UI 컴포넌트, 유틸리티, 타입, 상수
- 특정 도메인에 종속되지 않음

## 🚀 주요 개선사항

### 1. 프로바이더 분리

- `AppProvider`를 통한 전역 상태 관리 설정
- React Query, Jotai, Router 설정 중앙화

### 2. 명명 규칙 통일

- 모든 컴포넌트를 named export로 통일
- 일관된 파일 및 폴더 명명 규칙

### 3. 문서화 개선

- 각 컴포넌트와 함수에 JSDoc 주석 추가
- 역할과 책임을 명확히 정의

### 4. 구조 최적화

- 각 레이어별 명확한 책임 분리
- 의존성 방향 준수
- 재사용 가능한 컴포넌트 구조

## 📦 사용된 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **React Query** - 서버 상태 관리
- **Jotai** - 클라이언트 상태 관리
- **React Router** - 클라이언트 사이드 라우팅
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘 라이브러리

## 🔧 개발 가이드라인

### 1. 컴포넌트 작성 시

- 단일 책임 원칙 준수
- 명확한 props 인터페이스 정의
- 적절한 타입 정의

### 2. 상태 관리 시

- 로컬 상태는 `useState` 사용
- 전역 상태는 Jotai 사용
- 서버 상태는 React Query 사용

### 3. 파일 구조 시

- FSD 레이어 규칙 준수
- 관련 파일들을 같은 폴더에 배치
- 명확한 파일 명명

### 4. Import/Export 시

- 절대 경로 사용 (`@/` 별칭)
- Public API를 통한 export
- 순환 의존성 방지

## 🎯 다음 단계

1. **테스트 코드 추가** - 각 레이어별 단위 테스트
2. **성능 최적화** - React.memo, useMemo, useCallback 활용
3. **접근성 개선** - ARIA 속성 및 키보드 네비게이션
4. **국제화** - 다국어 지원 구조 추가
5. **에러 바운더리** - 에러 처리 및 복구 메커니즘
