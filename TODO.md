### FSD 리팩토링 TODO

- **목표**: `src/`를 FSD 아키텍처(Feature-Sliced Design)에 맞추어 `apps`, `shared`, `widgets`, `features`, `entities` 계층으로 재구성하고, 각 계층의 Public API를 `index.ts`로만 노출한다.

### 전역 원칙

- **Public API 규칙**: 외부 접근은 항상 각 슬라이스의 `index.ts`만 사용한다. 예) `@/features/add-cart`에서만 가져오고, `@/features/add-cart/ui/AddCart.tsx` 같은 딥 임포트 금지.
- **의존성 규칙**:
  - `shared`: 누구나 의존 가능. 외부 의존 금지.
  - `entities`: `shared`에만 의존 가능.
  - `features`: `entities`, `shared`에 의존 가능. 서로 간 직접 의존 지양.
  - `widgets`: `features`, `entities`, `shared`에 의존 가능. 비즈니스 로직 금지.
  - `apps`: 상위 조립 레이어. 모든 하위 레이어에 의존 가능하나 반대 방향 금지.
- **코드 스타일**: 선언형 프로그래밍, Clean Code 지향, 의미 있는 네이밍, 얕은 중첩, 가드 절 적극 사용.
- **파일 노출**: 각 슬라이스 루트의 `index.ts`에서만 export. 하위 파일은 외부 노출 금지.
- **그룹핑 디렉토리 규칙**: `features` 내부 도메인 그룹은 괄호 표기 폴더로 작성한다. 예) `(post)`, `(comment)`, `(user)`. 외부 임포트는 항상 하위 feature의 `index.ts`를 통해서만 한다.

### 경로 별칭(plan)

- 단일 별칭 사용: `@/*` → `src/*`.
- TS: `tsconfig.json`의 `compilerOptions.paths`에 `"@/*": ["./src/*"]` 설정 추가/정합화.
- Vite: `vite.config.ts`의 `resolve.alias`에 `'@': path.resolve(__dirname, './src')` 설정 확인.
- ESLint: 딥 임포트 방지를 위한 제한 규칙 유지(예: `import/no-restricted-paths` or `eslint-plugin-boundaries`).

### 목표 폴더 구조(스캐폴딩)

```
src/
  apps/
    routes/
      index.ts
  pages/
    home/
      ui/
  entities/
    post/
      model/
      ui/
      api/
      lib/
      index.ts
  features/
    (post)/
      add-post/
        model/
        ui/
        index.ts
      edit-post/
        model/
        ui/
        index.ts
      delete-post/
        model/
        ui/
        index.ts
      list-posts/
        model/
        ui/
        lib/
        index.ts
      filter-by-tag/
        model/
        ui/
        index.ts
      search-posts/
        model/
        ui/
        index.ts
      sort-posts/
        model/
        ui/
        index.ts
      paginate-posts/
        model/
        ui/
        index.ts
      view-post-detail/
        model/
        ui/
        index.ts
    (comment)/
      add-comment/
        model/
        ui/
        index.ts
      edit-comment/
        model/
        ui/
        index.ts
      delete-comment/
        model/
        ui/
        index.ts
      like-comment/
        model/
        ui/
        index.ts
      list-comments/
        model/
        ui/
        index.ts
    (user)/
      view-user-modal/
        model/
        ui/
        index.ts
  widgets/
    header/
      ui/
      index.ts
    footer/
      ui/
      index.ts
  shared/
    api/
    config/
    lib/
    styles/
    ui/
      button/
        button.tsx
        index.ts
      select/
        select.tsx
        index.ts
      ...
    index.ts
```

### 마이그레이션 체크리스트(순서)

1. [x] FSD 글 숙지 및 용어 정리: slice, segment(`model`, `ui`, `lib`, `api`), public API, 계층 의존성 규칙.
2. [x] 경로 별칭 점검: Vite `@` → `src` 설정 확인, TS `paths`에 `@/*` → `src/*` 동기화.
3. [x] ESLint 규칙 추가
4. [ ] 디렉토리 스캐폴딩 생성: 위 구조대로 빈 폴더 및 `index.ts` 파일 틀 준비.
5. [ ] 기존 `shared/ui/*` 점검: 각 컴포넌트 폴더에 `index.ts` 존재 확인. 없으면 생성하고 필요한 export만 노출.
6. [ ] 기존 `widgets/header`, `widgets/footer` 정리: 각 위젯 루트에 `index.ts` 생성 후 `ui/*`만 노출. 현재 파일(`widgets/header/header.tsx`, `widgets/footer/footer.tsx`)은 `ui/` 하위로 이동.
7. [ ] `pages/` 구조 FSD화: 괄호 그룹으로 도메인 구분. 예) `src/pages/(post)/posts-manager`.
8. [ ] 라우트 어댑터 유지: `apps/routes/*`는 `pages`의 public index만 import.
9. [ ] 모든 임포트 경로를 별칭 + Public API로 변경: 딥 임포트 제거. 예) `@/shared/ui/select`(index를 통한 노출)만 허용, `@/shared/ui/select/select.tsx` 금지.
10. [ ] 빌드/실행 점검: 타입 에러 및 런타임 이슈 수정.
11. [ ] 린트/포맷 통과 확인: import 정리, 순환 참조 없는지 확인.

### 사용 예시(공개 API만 노출)

- `features/ui/index.ts`를 만들 경우, 내부 구현 파일은 `features/ui/add-cart.tsx` 등으로 두고 외부에는 `index.ts`로만 노출.

```ts
// features/ui/index.ts
export { AddCart } from './add-cart';
```

```ts
// features/ui/add-cart.tsx
export function AddCart() {
  /* ... */
}
```

```ts
// apps/routes/ProductsPage.tsx
import { AddCart } from '@/features/ui'; // 내부 파일로의 직접 경로 사용 금지
```

### 자동화/검증

- ESLint: `import/no-restricted-paths` 또는 `eslint-plugin-boundaries`로 레이어 규칙과 딥 임포트 금지.
- depcruise(optional): 의존성 그래프 검증 및 순환 참조 탐지.
- ts-prune(optional): 미사용 export 정리.

### Done 정의

- 모든 공개 API가 `index.ts`를 통해서만 노출되고, 외부 딥 임포트가 없다.
- 레이어 의존성 규칙을 위반하는 임포트가 없다.
- 기존 기능은 동일하게 동작하며 빌드/테스트/린트가 모두 통과한다.

### 백로그(후순위)

- 슬라이스 생성 템플릿 추가(예: plop/hygen)로 `model/ui/lib/api/index.ts` 골격 자동 생성.
- 스토리북 도입 시 공개 API 기준으로만 스토리 노출.
- 라우트 스플리팅 및 코드 스플리팅 전략 수립.
