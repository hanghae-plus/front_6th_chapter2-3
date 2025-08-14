# 배럴 익스포트 가이드라인

## 개요

본 문서는 FSD(Feature-Sliced Design) 아키텍처에서 배럴 익스포트(Barrel Export)를 사용할 때의 경로 규칙과 그 이유를 설명합니다.

## 핵심 규칙

### 상대경로 vs 절대경로 사용 기준

| 관계 | 경로 유형 | 사용 케이스 | 예시 |
|------|-----------|-------------|------|
| **같은 모듈 내부** | 상대경로 (`./`, `../`) | 높은 응집성을 가진 코드들 | `./api`, `../model` |
| **다른 레이어 간** | 절대경로 (`@layer/`) | 레이어 간 의존성 | `@entities/user`, `@shared/ui` |

## 1. 상대경로 사용 규칙

### 적용 범위
- **같은 entity 내부**
- **같은 feature 내부** 
- **같은 widget 내부**
- **같은 shared 모듈 내부**

### 예시

```typescript
// ✅ entities/post/index.ts - 같은 entity 내부
export * from "./api"
export * from "./model/types"
export * from "./lib"

// ✅ features/remove-post/ui/remove-post-button.tsx - 같은 feature 내부
import { useRemovePost } from "../model"

// ✅ features/remove-post/index.ts - 같은 feature 내부
export * from "./model"
export * from "./ui"
```

### 이유
1. **높은 응집성 표현**: 같은 모듈은 강하게 결합되어 함께 변경됨
2. **리팩토링 용이성**: 폴더째 이동해도 내부 경로가 유지됨
3. **모듈 독립성**: 외부 의존 없이 모듈 단위로 동작 가능

## 2. 절대경로 사용 규칙

### 적용 범위
- **다른 entity 참조**
- **다른 레이어 간 의존성**
- **FSD 레이어 경계를 넘는 모든 import**
- **레이어 최상위 배럴 내부** (features/index.ts, widgets/index.ts)

### 예시

```typescript
// ✅ entities/post/model/types.ts - 다른 entity 참조
import type { User } from "@entities/user"

// ✅ widgets/post-table/index.tsx - 다른 레이어들 참조
import { Button } from "@shared/ui"
import { RemovePostButton } from "@features/remove-post"
import type { Post } from "@entities/post"

// ✅ features/remove-post/ui/remove-post-button.tsx - 다른 레이어 참조
import { Button } from "@shared/ui"
```

### 이유
1. **레이어 경계 명확화**: 어느 레이어에서 온 것인지 즉시 파악 가능
2. **FSD 의존성 규칙 강제**: `pages → widgets → features → entities → shared`
3. **변경 영향도 예측**: 레이어 간 변경의 파급효과를 쉽게 파악
4. **가독성 향상**: 긴 상대경로(`../../entity/model/types`) 방지

## 3. FSD 레이어별 적용 예시

### entities 레이어
```typescript
// entities/post/index.ts
export * from "./api"           // ✅ 상대경로: 같은 entity
export * from "./model/types"   // ✅ 상대경로: 같은 entity
export * from "./lib"           // ✅ 상대경로: 같은 entity

// entities/post/model/types.ts
import type { User } from "@entities/user"  // ✅ 절대경로: 다른 entity
```

### features 레이어
```typescript
// features/remove-post/ui/remove-post-button.tsx
import { Button } from "@shared/ui"         // ✅ 절대경로: 다른 레이어
import { useRemovePost } from "../model"    // ✅ 상대경로: 같은 feature

// features/remove-post/index.ts
export * from "./model"  // ✅ 상대경로: 같은 feature
export * from "./ui"     // ✅ 상대경로: 같은 feature
```

### widgets 레이어
```typescript
// widgets/post-table/index.tsx
import { Table } from "@shared/ui"              // ✅ 절대경로: shared 레이어
import { RemovePostButton } from "@features/remove-post"  // ✅ 절대경로: features 레이어
import type { Post } from "@entities/post"     // ✅ 절대경로: entities 레이어

// widgets/index.ts
export { PostTable } from "@/widgets/post-table"  // ✅ 절대경로: 같은 레이어이지만 위젯 간 독립성
```

### pages 레이어
```typescript
// pages/index.ts
export { default as PostsManagerPage } from "./PostsManagerPage"  // ✅ 상대경로: 같은 페이지 레이어

// pages/PostsManagerPage.tsx
import { PostTable, PostFilters } from "@widgets"      // ✅ 절대경로: 다른 레이어
import type { Post } from "@entities/post"             // ✅ 절대경로: 다른 레이어
import { Button } from "@shared/ui"                     // ✅ 절대경로: 다른 레이어
```

## 4. 중복 export 방지

### 문제가 되는 패턴
```typescript
// ❌ 중복 export (api/index.ts에서 이미 export하고 있음)
export * from "./api"
export * from "./api/queries"
export * from "./api/mutations"
```

### 올바른 패턴
```typescript
// ✅ api/index.ts에서 이미 queries, mutations를 export하므로 api만 export
export * from "./api"
export * from "./model/types"
```

## 5. 배럴 익스포트 우회 방지

### 문제가 되는 패턴
```typescript
// ❌ 배럴 익스포트 우회
import { User } from "../../user/model/types"
import { RemovePostButton } from "@/features/remove-post/ui"
```

### 올바른 패턴
```typescript
// ✅ 배럴 익스포트 사용
import type { User } from "@entities/user"
import { RemovePostButton } from "@features/remove-post"
```

## 6. 실제 적용 효과

### Before (문제가 있던 구조)
```typescript
// entities/comment/index.ts - 절대경로와 상대경로 혼용
export * from "@entities/comment/api"        // ❌ 절대경로
export * from "./model/types"                // ❌ 혼용

// widgets/post-table/index.tsx - 배럴 우회
import { RemovePostButton } from "@/features/remove-post/ui"  // ❌ 직접 접근
```

### After (수정된 구조)
```typescript
// entities/comment/index.ts - 상대경로로 통일
export * from "./api"          // ✅ 상대경로 통일
export * from "./model/types"  // ✅ 상대경로 통일

// widgets/post-table/index.tsx - 배럴 익스포트 사용
import { RemovePostButton } from "@features/remove-post"  // ✅ 배럴 익스포트
```

## 7. 회고 시 체크포인트

### 질문해볼 점들
1. **경로 일관성**: 같은 레이어/모듈 내에서 경로 방식이 일관된가?
2. **레이어 경계**: 절대경로가 FSD 레이어 의존성 규칙을 잘 표현하는가?
3. **가독성**: 경로만 보고도 코드의 구조적 의도를 파악할 수 있는가?
4. **리팩토링 용이성**: 모듈 이동 시 내부 경로가 깨지지 않는가?
5. **배럴 우회**: 직접 경로 접근 대신 배럴 익스포트를 사용했는가?

### 개선 지표
- [ ] 모든 entity 내부에서 상대경로 사용
- [ ] 모든 feature 내부에서 상대경로 사용  
- [ ] 레이어 간 의존성에서 절대경로 사용
- [ ] 중복 export 제거
- [ ] 배럴 익스포트 우회 사례 제거
- [ ] pages 레이어 배럴 익스포트 구축

## 8. 배럴 공개 범위 규칙

### 레이어별 공개 정책

| 레이어 | 공개 범위 | 이유 |
|--------|-----------|------|
| **entities** | 모든 API, 타입, 유틸 | 비즈니스 로직의 완전한 재사용성 |
| **features** | UI 컴포넌트만 | 캡슐화, hooks는 feature별 독립성 |
| **widgets** | UI 컴포넌트만 | 위젯의 단순한 조합 인터페이스 |
| **shared** | 모든 유틸, 타입, UI | 범용 재사용성 |
| **pages** | 페이지 컴포넌트만 | 라우팅용 진입점 |

### 예시

```typescript
// ✅ features/index.ts - UI만 공개
export { AddPostForm } from "@features/add-post/ui"
export { RemovePostButton } from "@features/remove-post/ui"
// hooks는 직접 접근: @features/feature-name/model

// ✅ widgets/index.ts - UI만 공개  
export { PostTable } from "@widgets/post-table"
export { PostFilters } from "@widgets/post-filters"
```

## 9. 중복 Export 방지

### 문제
```typescript
// ❌ 중복 - api/index.ts에서 이미 export
export * from "./api"
export * from "./api/queries"
export * from "./api/mutations"
```

### 해결
```typescript
// ✅ api/index.ts가 queries, mutations를 포함
export * from "./api"
export * from "./model/types"
```

## 10. 레이어 최상위 배럴 규칙

### 특별 규칙: 절대경로 사용
```typescript
// ✅ features/index.ts에서 절대경로
export { AddPostForm } from "@features/add-post/ui"

// ✅ widgets/index.ts에서 절대경로
export { PostTable } from "@widgets/post-table"
```

### 이유
1. **명시적 의존성**: 어떤 서브모듈을 공개하는지 명확
2. **일관성**: 모든 최상위 배럴이 동일한 패턴
3. **리팩토링 안전성**: 내부 구조 변경 시 영향 최소화

## 결론

이 가이드라인을 통해:
- **코드의 구조적 의도**를 경로만으로도 파악 가능
- **FSD 아키텍처의 레이어 분리 원칙**을 자연스럽게 강제
- **리팩토링과 유지보수**가 용이한 코드베이스 구축
- **팀원 간 일관된 코딩 스타일** 확립
- **배럴 공개 범위**의 명확한 기준 확립

상대경로와 절대경로의 사용 기준을 명확히 하여, 더 읽기 쉽고 유지보수하기 좋은 코드를 작성할 수 있습니다.