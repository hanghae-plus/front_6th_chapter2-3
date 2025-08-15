# Posts Manager - FSD Architecture

이 프로젝트는 기존의 모놀리식 PostsManagerPage를 Feature-Sliced Design (FSD) 아키텍처로 리팩토링한 버전입니다.

## 실행 방법

### FSD 버전 (리팩토링된 버전)
```bash
# 개발 서버 실행
pnpm dev

# 또는
pnpm start
```

### Origin 버전 (기존 코드)
```bash
# Origin 버전 개발 서버 실행 (포트 5174)
pnpm start:origin
```

## 프로젝트 구조

### FSD 버전
```
src/
├── app/           # 전역 설정 (라우터, 프로바이더, 스토어)
├── entities/      # 비즈니스 엔티티 (posts, users, comments)
├── features/      # 기능 단위 (posts-management, post-detail, user-profile)
├── widgets/       # 기능 조합 (posts-manager)
├── pages/         # 페이지 라우팅
└── shared/        # 공통 컴포넌트 및 유틸리티
```

### Origin 버전
```
src/components/
└── PostsManagerPageOrigin.tsx  # 기존 모놀리식 코드
```

## 주요 변경사항

1. **아키텍처**: 모놀리식 → FSD (Feature-Sliced Design)
2. **상태 관리**: useState → Jotai
3. **컴포넌트 분리**: 단일 파일 → 기능별 분리
4. **타입 안전성**: TypeScript strict 모드 적용
5. **성능 최적화**: useCallback, 메모이제이션 적용

## 기능 비교

두 버전 모두 동일한 기능을 제공합니다:
- 게시물 목록 조회
- 게시물 검색 및 필터링
- 게시물 추가/수정/삭제
- 댓글 관리
- 사용자 프로필 조회
- 페이지네이션
- 정렬 기능