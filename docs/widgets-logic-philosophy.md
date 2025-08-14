# Widgets 레이어의 로직 철학

## 개요

FSD(Feature-Sliced Design)에서 widgets 레이어는 **복합 UI 블록**의 역할을 하며, 특정 상황에서는 UI 내부에 로직을 포함하는 것이 적절합니다. 본 문서는 widgets에서 로직의 역할과 UI에 로직을 남겨두는 이유를 설명합니다.

## Widgets 레이어의 특성

### 1. Widgets의 정의
- **복합 UI 블록**: 여러 features와 entities를 조합하여 완성된 인터페이스를 제공
- **비즈니스 가치 제공**: 단순한 UI 컴포넌트가 아닌, 사용자에게 의미 있는 기능을 제공
- **자립적 단위**: 독립적으로 동작할 수 있는 완전한 UI 모듈

### 2. Features vs Widgets 차이점

| 특성 | Features | Widgets |
|------|----------|---------|
| **목적** | 단일 사용자 액션 | 복합 UI 인터페이스 |
| **범위** | 좁고 구체적 | 넓고 포괄적 |
| **로직** | 도메인 로직 중심 | 조합 및 조정 로직 |
| **재사용성** | 높음 | 중간 |

## Widgets에 로직이 있는 이유

### 1. 조합 로직 (Composition Logic)

#### 예시: PostTable의 데이터 조합
```typescript
// widgets/post-table/ui/post-table.tsx
const PostTable = ({ searchQuery, ... }) => {
  // 여러 entities의 데이터를 조합
  const { data: postsData } = useGetPosts(...)
  const { data: searchData } = useGetPostSearch(...)
  const { data: tagData } = useGetPostsByTag(...)
  const { data: usersData } = useGetUsers(...)
  
  // 조건에 따른 데이터 선택 로직
  const getPostDataByFilter = () => {
    if (searchQuery) return searchData
    if (param.tag && param.tag !== "all") return tagData
    return postsData
  }
  
  // 데이터 병합 로직
  const postsWithAuthors = useMemo(() => {
    return mergePostsWithAuthors(activePostsData?.posts, usersData?.users)
  }, [activePostsData?.posts, usersData?.users])
}
```

**이 로직이 widgets에 있는 이유:**
- **entities 간 조합**: 여러 entity의 데이터를 위젯 수준에서 조합
- **조건부 데이터 선택**: UI 상태에 따른 데이터 선택 로직
- **위젯 전용**: 다른 곳에서 재사용되지 않는 PostTable만의 로직

### 2. 상태 조정 로직 (State Coordination)

#### 예시: Pagination의 계산 로직
```typescript
// widgets/pagination/ui/pagination.tsx
const Pagination = ({ total, ... }) => {
  const { param } = usePostQueryParams()
  
  // 페이지네이션 상태 계산
  const currentStart = Math.min(param.skip + 1, total)
  const currentEnd = Math.min(param.skip + param.limit, total)
  const canPrev = param.skip === 0
  const canNext = param.skip + param.limit >= total
}
```

**이 로직이 widgets에 있는 이유:**
- **UI 표시 로직**: 화면에 표시할 정보를 계산
- **위젯 특화**: Pagination 위젯에서만 필요한 계산
- **즉시 사용**: 계산 결과를 바로 UI에 사용

### 3. 로딩 상태 통합 (Loading State Integration)

#### 예시: PostTable의 로딩 상태
```typescript
const PostTable = () => {
  const { isLoading: isLoadingPosts } = useGetPosts(...)
  const { isLoading: isLoadingSearch } = useGetPostSearch(...)
  const { isLoading: isLoadingTag } = useGetPostsByTag(...)
  const { isLoading: isLoadingUsers } = useGetUsers(...)
  
  // 통합 로딩 상태
  const isLoading = isLoadingPosts || isLoadingSearch || isLoadingTag || isLoadingUsers
  
  return (
    <>
      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <div>실제 콘텐츠</div>
      )}
    </>
  )
}
```

**이 로직이 widgets에 있는 이유:**
- **다중 로딩 상태 통합**: 여러 API 호출의 로딩 상태를 하나로 관리
- **UI 직결**: 로딩 상태가 바로 UI 렌더링에 영향
- **위젯 책임**: 위젯이 관리하는 모든 데이터의 로딩 상태

## UI에 로직을 남겨두는 이유

### 1. 응집성 (Cohesion)

#### 장점
```typescript
// ✅ 높은 응집성: 관련 로직이 한 곳에
const PostTable = () => {
  const data = usePostData()        // 데이터 로직
  const calculations = calculate()   // 계산 로직
  
  return <UI data={data} />         // UI 로직
}
```

```typescript
// ❌ 낮은 응집성: 로직이 분산됨
const PostTable = () => {
  const data = usePostTableModel()  // model/use-post-table.ts
  const utils = usePostTableUtils() // lib/post-table-utils.ts
  
  return <UI data={data} />
}
```

### 2. 가독성 (Readability)

#### 한 곳에서 모든 흐름 파악 가능
```typescript
const PostTable = ({ searchQuery }) => {
  // 1. 데이터 조회
  const { data: postsData } = useGetPosts(...)
  
  // 2. 조건부 선택
  const activeData = searchQuery ? searchData : postsData
  
  // 3. 데이터 변환
  const processedData = useMemo(() => process(activeData), [activeData])
  
  // 4. UI 렌더링
  return <Table data={processedData} />
}
```

**장점:**
- **선형적 흐름**: 데이터 → 가공 → 렌더링 순서로 읽기 쉬움
- **컨텍스트 유지**: UI와 로직의 관계를 즉시 파악 가능
- **디버깅 용이**: 한 파일에서 전체 동작 추적 가능

### 3. 변경 용이성 (Changeability)

#### UI와 밀접한 로직의 변경
```typescript
// UI 변경 시 로직도 함께 변경되는 경우
const PostTable = () => {
  // UI 요구사항: "검색 중일 때는 다른 로딩 메시지"
  const isSearching = !!searchQuery && isLoadingSearch
  const isRegularLoading = !searchQuery && isLoadingPosts
  
  return (
    <>
      {isSearching && <div>검색 중...</div>}
      {isRegularLoading && <div>로딩 중...</div>}
      {/* ... */}
    </>
  )
}
```

**장점:**
- **함께 변경**: UI 변경 시 관련 로직도 함께 수정
- **영향 범위 제한**: 다른 모듈에 영향 없이 위젯 내부에서만 변경
- **빠른 이터레이션**: UI/UX 개선 시 빠르게 적용 가능

### 4. 과도한 추상화 방지

#### 불필요한 분리의 문제점
```typescript
// ❌ 과도한 추상화
// model/use-post-table-data.ts
export const usePostTableData = () => { /* 복잡한 hook */ }

// model/use-post-table-loading.ts  
export const usePostTableLoading = () => { /* 로딩 상태만 */ }

// lib/post-table-utils.ts
export const calculatePagination = () => { /* 간단한 계산 */ }

// ui/post-table.tsx
const PostTable = () => {
  const data = usePostTableData()
  const loading = usePostTableLoading()  
  const pagination = calculatePagination()
  
  return <UI />  // 실제 UI 로직은 거의 없음
}
```

```typescript
// ✅ 적절한 추상화
const PostTable = () => {
  // 위젯 수준의 로직은 함께 관리
  const { data, isLoading } = usePostTableLogic()
  
  return <UI data={data} loading={isLoading} />
}
```

## 언제 로직을 분리해야 하는가?

### 분리 기준

| 상황 | 권장사항 | 이유 |
|------|----------|------|
| **UI 직결 로직** | UI에 유지 | 응집성, 가독성 |
| **복잡한 계산** | lib로 분리 | 재사용성, 테스트 용이성 |
| **상태 관리** | model로 분리 | 복잡도 관리 |
| **API 조합** | UI에 유지 | 위젯 특화 로직 |

### 실제 예시

#### ✅ UI에 남겨두는 경우
```typescript
// 위젯 특화된 데이터 조합
const getPostDataByFilter = () => {
  if (searchQuery) return searchData
  if (param.tag !== "all") return tagData  
  return postsData
}

// UI 상태 계산
const currentPage = Math.floor(param.skip / param.limit) + 1
```

#### ✅ 분리하는 경우
```typescript
// lib/pagination-utils.ts - 재사용 가능한 순수 함수
export const calculatePaginationInfo = (skip: number, limit: number, total: number) => {
  return {
    currentPage: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(total / limit),
    hasNext: skip + limit < total,
    hasPrev: skip > 0
  }
}

// model/use-complex-state.ts - 복잡한 상태 관리
export const useComplexWidgetState = () => {
  const [state, setState] = useState(initialState)
  // 복잡한 상태 로직...
  return { state, actions }
}
```

## FSD Widgets 로직 원칙

### 1. **조합 우선** (Composition First)
- entities와 features를 조합하는 것이 주 목적
- 새로운 비즈니스 로직은 entities나 features로

### 2. **UI 응집성** (UI Cohesion)  
- UI와 밀접한 로직은 함께 관리
- 과도한 분리로 인한 복잡도 증가 방지

### 3. **적절한 추상화** (Right Abstraction)
- 재사용되지 않는 로직은 분리하지 않음
- 복잡도가 높아질 때만 선택적 분리

### 4. **변경 용이성** (Easy Change)
- UI 변경 시 관련 로직도 함께 변경 가능
- 위젯 단위의 독립적 수정 지원

## 결론

Widgets 레이어의 로직은 **"조합과 조정"**의 역할을 하며, UI와 밀접한 관계에 있을 때는 분리하지 않는 것이 FSD 철학에 더 부합합니다. 

**핵심 원칙:**
- **응집성 > 분리**: 관련된 것들은 함께 두기
- **가독성 > 추상화**: 이해하기 쉬운 코드가 우선  
- **실용성 > 이론**: 과도한 분리보다는 적절한 수준 유지

이를 통해 maintainable하고 readable한 widgets 레이어를 구축할 수 있습니다.