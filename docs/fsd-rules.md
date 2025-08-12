# FSD (Feature-Sliced Design) 레이어 Import 규칙

## 개요

FSD 아키텍처의 핵심 원칙을 ESLint를 통해 강제하는 규칙들입니다. 이 규칙들은 레이어 간 의존성 방향을 제어하고, 아키텍처의 일관성을 유지하는 데 도움을 줍니다.

## 레이어 구조

```
src/
├── 1_app/          # 애플리케이션 레이어 (최상위)
├── 2_pages/        # 페이지 레이어
├── 3_widgets/      # 위젯 레이어
├── 4_features/     # 기능 레이어
├── 5_entities/     # 엔티티 레이어
└── 6_shared/       # 공유 레이어 (최하위)
```

## Import 규칙

### 1. `fsd/forbidden-imports` - 금지된 Import

**설정**: `'error'`

**목적**: FSD 레이어 간 올바른 의존성 방향 강제

**규칙**:

- 상위 레이어는 하위 레이어를 import할 수 있음
- 하위 레이어는 상위 레이어를 import할 수 없음
- 예: `features`는 `pages`를 import할 수 없음

**예시**:

```typescript
// ❌ 잘못된 예시
// src/4_features/user-profile/index.ts
import { UserProfilePage } from '@/2_pages/user-profile';
// 금지!

// ✅ 올바른 예시
// src/2_pages/user-profile/index.ts
import { UserProfileWidget } from '@/3_widgets/user-profile';

// 허용
```

### 2. `fsd/no-relative-imports` - 상대 경로 Import 금지

**설정**: `'error'`

**목적**: 절대 경로(@) 사용 강제로 코드 가독성 향상

**규칙**:

- 슬라이스/레이어 간 import 시 상대 경로 사용 금지
- 별칭(@) 사용 필수
- 같은 슬라이스 내에서는 상대 경로 허용

**예시**:

```typescript
// ❌ 잘못된 예시
import { Button } from '../../../shared/ui/button';

// ✅ 올바른 예시
import { Button } from '@/6_shared/ui/button';
```

### 3. `fsd/no-public-api-sidestep` - Public API 우회 금지

**설정**: `'error'`

**목적**: Public API(index 파일)를 통한 import만 허용

**규칙**:

- 각 슬라이스의 내부 구현을 직접 import 금지
- 반드시 index 파일을 통해 export된 것만 import

**예시**:

```typescript
// ❌ 잘못된 예시
import { UserCard } from '@/5_entities/user/ui/user-card';

// ✅ 올바른 예시
import { UserCard } from '@/5_entities/user';
```

### 4. `fsd/no-cross-slice-dependency` - 슬라이스 간 직접 의존성 방지

**설정**: `'error'`

**목적**: 같은 레이어 내 슬라이스 간 직접 import 방지

**규칙**:

- 같은 레이어의 다른 슬라이스를 직접 import 금지
- 공통 기능은 shared 레이어로 이동

**예시**:

```typescript
// ❌ 잘못된 예시
// src/4_features/auth/index.ts
import { userSlice } from '@/4_features/user';
// 같은 레이어 간 import 금지

// ✅ 올바른 예시
// 공통 기능을 shared로 이동
import { authUtils } from '@/6_shared/lib/auth';
```

### 5. `fsd/no-ui-in-business-logic` - 비즈니스 로직에서 UI Import 방지

**설정**: `'error'`

**목적**: 비즈니스 로직과 UI 로직의 분리

**규칙**:

- 비즈니스 로직 레이어에서 UI 컴포넌트 import 금지
- UI는 상위 레이어에서만 사용

**예시**:

```typescript
// ❌ 잘못된 예시
// src/5_entities/user/model/user-slice.ts
import { UserCard } from './ui/user-card'; // 비즈니스 로직에서 UI import 금지

// ✅ 올바른 예시
// UI는 상위 레이어에서 사용
// src/3_widgets/user-profile/index.ts
import { UserCard } from '@/5_entities/user';
```

### 6. `fsd/no-global-store-imports` - 전역 스토어 직접 Import 금지

**설정**: `'error'`

**목적**: 전역 상태 관리의 중앙화

**규칙**:

- 전역 스토어를 직접 import 금지
- 반드시 shared 레이어를 통해 접근

**예시**:

```typescript
// ❌ 잘못된 예시
import { store } from '@/1_app/store';
// ✅ 올바른 예시
import { useAppStore } from '@/6_shared/lib/store';
```

### 7. `fsd/ordered-imports` - Import 순서 강제

**설정**: `'warn'`

**목적**: FSD 레이어 기반으로 import 순서 강제

**규칙**:

- 레이어 순서대로 import 정렬
- 1_app → 2_pages → 3_widgets → 4_features → 5_entities → 6_shared

**예시**:

```typescript
// ✅ 올바른 순서
import { AppProvider } from '@/1_app/providers';
import { UserProfilePage } from '@/2_pages/user-profile';
import { UserProfileWidget } from '@/3_widgets/user-profile';
import { useUserProfile } from '@/4_features/user-profile';
import { User } from '@/5_entities/user';
import { Button } from '@/6_shared/ui/button';
```

## 설정 방법

### ESLint 설정

```javascript
// eslint.config.js
import fsdPlugin from 'eslint-plugin-fsd-lint';

export default tseslint.config({
  extends: [
    // ... 기존 설정
    fsdPlugin.configs.recommended,
  ],
  plugins: {
    // ... 기존 플러그인
    fsd: fsdPlugin,
  },
  rules: {
    // FSD Rules
    'fsd/forbidden-imports': 'error',
    'fsd/no-relative-imports': 'error',
    'fsd/no-public-api-sidestep': 'error',
    'fsd/no-cross-slice-dependency': 'error',
    'fsd/no-ui-in-business-logic': 'error',
    'fsd/no-global-store-imports': 'error',
    'fsd/ordered-imports': 'warn',
  },
});
```

## 모범 사례

### 1. 슬라이스 구조

```
src/4_features/user/
├── index.ts          # Public API
├── model/
│   ├── user-slice.ts
│   └── types.ts
├── ui/
│   └── user-card.tsx
└── lib/
    └── user-utils.ts
```

### 2. Public API 작성

```typescript
// src/4_features/user/index.ts
export { UserCard } from './ui/user-card';
export { userSlice } from './model/user-slice';
export type { User } from './model/types';
```

### 3. Import 패턴

```typescript
// ✅ 권장 패턴
import { type User, UserCard, userSlice } from '@/4_features/user';
import { Button } from '@/6_shared/ui/button';
```

## 주의사항

1. **점진적 적용**: 기존 프로젝트에 적용 시 점진적으로 도입
2. **예외 처리**: 특수한 경우 ESLint disable 주석 사용
3. **팀 교육**: 팀원들과 FSD 원칙 공유 및 교육
4. **리뷰**: 코드 리뷰 시 FSD 규칙 준수 여부 확인

## 도구 지원

- **ESLint**: 자동 검사 및 수정
- **VS Code**: 실시간 오류 표시
- **Pre-commit hooks**: 커밋 전 자동 검사
- **CI/CD**: 빌드 시 자동 검사
