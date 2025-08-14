# Post Management System - FSD Best Practice Architecture

## 📁 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처의 **Best Practice**를 적용하여 구성되어 있습니다.

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

## 🏗️ FSD Best Practice 원칙

### 1. 레이어 의존성 규칙

- **상위 레이어는 하위 레이어를 import할 수 있음**
- **하위 레이어는 상위 레이어를 import할 수 없음**
- **같은 레이어 내에서는 직접 의존성 방지**

### 2. 각 레이어의 역할

#### 1_app (애플리케이션 레이어)

- 애플리케이션 초기화 및 설정
- 전역 프로바이더 설정 (React Query, Jotai, Router)
- 애플리케이션 레이아웃 구조
- 라우팅 설정

#### 2_pages (페이지 레이어)

- 라우팅 가능한 페이지 컴포넌트
- 위젯과 기능을 조합하여 완전한 페이지 구성
- 비즈니스 로직은 포함하지 않음
- 레이아웃과 네비게이션 담당

#### 3_widgets (위젯 레이어)

- 독립적인 UI 블록
- 여러 기능을 조합한 복합 컴포넌트
- 재사용 가능한 레이아웃 요소
- 비즈니스 로직과 UI 로직 분리

#### 4_features (기능 레이어)

- 사용자 행동과 관련된 기능
- 비즈니스 로직과 UI 로직 포함
- 특정 도메인에 종속된 기능
- 재사용 가능한 기능 단위

#### 5_entities (엔티티 레이어)

- 비즈니스 엔티티 정의
- API 통신, 데이터 모델, 타입 정의
- 도메인 로직 포함
- 순수한 비즈니스 로직

#### 6_shared (공유 레이어)

- 애플리케이션 전체에서 공통으로 사용되는 코드
- UI 컴포넌트, 유틸리티, 타입, 상수
- 특정 도메인에 종속되지 않음
- 재사용 가능한 공통 요소

## 🚀 주요 Best Practice 적용사항

### 1. 프로바이더 분리 및 중앙화

- `AppProvider`를 통한 전역 상태 관리 설정
- React Query, Jotai, Router 설정 중앙화
- 개발 도구 설정 통합

### 2. 타입 안전성 강화

- 완전한 TypeScript 지원
- 제네릭을 활용한 타입 추론
- 컴파일 타임 타입 체크

### 3. 낙관적 업데이트 시스템

- `useOptimisticMutation` 훅으로 일관된 낙관적 업데이트
- 자동 롤백 기능
- 타입 안전한 낙관적 업데이트 유틸리티

### 4. 명명 규칙 통일

- 모든 컴포넌트를 named export로 통일
- 일관된 파일 및 폴더 명명 규칙
- 명확한 역할과 책임 분리

### 5. 문서화 개선

- 각 컴포넌트와 함수에 JSDoc 주석 추가
- 역할과 책임을 명확히 정의
- FSD 원칙에 따른 구조 설명

### 6. 구조 최적화

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
- 재사용 가능한 구조 설계

### 2. 상태 관리 시

- 로컬 상태는 `useState` 사용
- 전역 상태는 Jotai 사용
- 서버 상태는 React Query 사용
- 낙관적 업데이트는 `useOptimisticMutation` 사용

### 3. 파일 구조 시

- FSD 레이어 규칙 준수
- 관련 파일들을 같은 폴더에 배치
- 명확한 파일 명명
- Public API를 통한 export

### 4. Import/Export 시

- 절대 경로 사용 (`@/` 별칭)
- Public API를 통한 export
- 순환 의존성 방지
- 명시적 import 사용

### 5. 성능 최적화

- React.memo, useMemo, useCallback 활용
- 불필요한 리렌더링 방지
- 코드 스플리팅 적용
- 지연 로딩 구현

## 🎯 다음 단계

1. **테스트 코드 추가** - 각 레이어별 단위 테스트
2. **성능 최적화** - React.memo, useMemo, useCallback 활용
3. **접근성 개선** - ARIA 속성 및 키보드 네비게이션
4. **국제화** - 다국어 지원 구조 추가
5. **에러 바운더리** - 에러 처리 및 복구 메커니즘
6. **코드 스플리팅** - 동적 import를 통한 번들 최적화
7. **PWA 지원** - 서비스 워커 및 오프라인 기능
8. **성능 모니터링** - 성능 메트릭 수집 및 분석

## 📚 참고 자료

- [Feature-Sliced Design Methodology](https://feature-sliced.design/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Jotai Documentation](https://jotai.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
