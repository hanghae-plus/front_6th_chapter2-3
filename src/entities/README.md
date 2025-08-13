# Entities Layer

프로젝트의 핵심 데이터 개념을 나타내는 레이어입니다.

## 역할

- 비즈니스 도메인 모델 정의
- 데이터 타입과 검증 스키마
- Entity별 기본 UI 컴포넌트

## 구조

```
entities/
└── entity-name/
    ├── model/      # 데이터 타입, 스키마
    ├── api/        # Entity 관련 API
    └── ui/         # Entity 표현 컴포넌트
```

## Entity 간 관계

- **원칙**: Entity 간 직접 의존성 최소화
- **교차 참조**: `@x` 표기로 명시적 연결

```typescript
// entities/post/model/post.ts
import type { User } from "entities/user/@x/post"

export interface Post {
  title: string
  author: User
}
```

## 예시

- User, Post, Comment 등 비즈니스 용어
