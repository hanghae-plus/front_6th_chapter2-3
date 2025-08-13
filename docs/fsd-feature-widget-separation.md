# FSD 아키텍처에서 Feature와 Widget 분리 기준에 대한 회고

## 들어가며

Feature-Sliced Design(FSD)을 프로젝트에 적용하면서 가장 애매했던 부분은 **UI 컴포넌트를 어디에 배치할지 결정하는 것**이었다. 특히 "기능 중심의 UI를 분리하고, 거기서 model과 lib를 뽑아내는" 과정에서 많은 고민이 있었다.

## 핵심 고민사항

### 1. UI가 기능별로 명확하게 분리되는 경우만 Feature로 분리해야 하는가?

**결론: 기능의 책임 범위로 판단한다**

- **Feature로 분리해야 하는 경우:**
  - 비즈니스 행위(use-case)를 캡슐화하는 컴포넌트
  - 서버 요청, 검증, 캐시 무효화까지 책임지는 UI
  - 예: `AddPostForm`, `EditPostForm`처럼 폼 제출과 관련된 모든 로직을 포함

- **Feature로 분리하지 않는 경우:**
  - 순수 시각적(visual) 컴포넌트
  - 단순 조합(composition) 컴포넌트
  - 예: `Card`, `Table`, `Dialog` 같은 재사용 가능한 UI 컴포넌트들

**판단 기준:** "도메인 행동을 수행한다" + "내부 상태/사이드이펙트를 관리한다" ⇒ Feature

### 2. UI와 로직이 섞여있는 경우, Widget에만 UI를 두는 것이 좋은가?

**결론: 점진적 접근이 현실적이다**

**"애매하면 Widget" 규칙:**

- 초기에는 Widget으로 시작
- 도메인 로직이 점점 많아지면 Feature로 승급(promotion)
- FSD에서는 slice 간 파일 이동이 쉽기 때문에 부담이 적음

## 기능 중심 설계를 위한 체크리스트

컴포넌트를 Feature로 승급할지 판단하는 기준:

1. **단일 책임:** 이 컴포넌트가 한 가지 행위(글 작성, 좋아요 토글 등)를 담당하는가?
2. **모델 의존성:** 그 행위를 위해 model(store/query/mutation)이 필요한가?
3. **재사용성:** 같은 행위를 여러 화면에서 재사용할 가능성이 있는가?

세 항목이 모두 Yes라면 Feature로 승급한다.

## 프로젝트 컴포넌트 분석 결과

실제 프로젝트의 모든 컴포넌트를 체크리스트 기준으로 분석한 결과:

| 컴포넌트               | 단일 책임         | 모델 의존성       | 분리 점수     | 상태            | 비고                         |
| ---------------------- | ----------------- | ----------------- | ------------- | --------------- | ---------------------------- |
| **add-post**           | ✅ 게시물 생성    | ✅ usePostPost    | **🟢 HIGH**   | ✅ **분리완료** | CRUD + 복잡한 상태 관리      |
| **edit-post**          | ✅ 게시물 수정    | ✅ usePutPost     | **🟢 HIGH**   | ✅ **분리완료** | CRUD + 초기값 설정           |
| **add-comment**        | ✅ 댓글 생성      | ✅ usePostComment | **🟢 HIGH**   | ✅ **분리완료** | CRUD + postId 의존성         |
| **edit-comment**       | ✅ 댓글 수정      | ✅ usePutComment  | **🟢 HIGH**   | ✅ **분리완료** | CRUD + 초기값 설정           |
| **remove-post**        | ✅ 게시물 삭제    | ✅ useDeletePost  | **🟢 HIGH**   | ✅ **분리완료** | DELETE 작업 + 확인 로직      |
| **like-comment**       | ✅ 댓글 좋아요    | ✅ usePatchLikes  | **🟢 HIGH**   | ✅ **분리완료** | PATCH + optimistic update    |
| **remove-comment**     | ✅ 댓글 삭제      | ✅ useDeleteComment | **🟢 HIGH**   | ✅ **분리완료** | DELETE + 즉시 UI 업데이트    |
| **post-filters**       | ✅ 필터/검색 제어 | ✅ tags API       | **🟡 MEDIUM** | ❌ **유지**     | props drilling으로 분리불가  |
| **user-dialog**        | ❌ 단순 조회      | ❌ GET만          | **🔴 LOW**    | ❌ **유지**     | 단순 데이터 표시             |
| **post-detail-dialog** | ❌ 조합 위젯      | ❌ GET + 조합     | **🔴 LOW**    | ❌ **유지**     | Feature들을 배치하는 역할    |
| pagination             | ❌ 순수 UI        | ❌ 계산만         | **🔴 LOW**    | ❌ **유지**     | 비즈니스 로직 없음           |
| header                 | ❌ 레이아웃       | ❌ 없음           | **🔴 LOW**    | ❌ **유지**     | 단순 네비게이션              |
| footer                 | ❌ 레이아웃       | ❌ 없음           | **🔴 LOW**    | ❌ **유지**     | 정적 컨텐츠                  |
| post-table             | ❌ 데이터 표시    | ❌ 복합 API 호출  | **🔴 LOW**    | ❌ **유지**     | 복합 UI 블록 + 데이터 통합   |

### 분석 결과 요약

**🟢 HIGH (Feature 분리 완료):**

- **사용자 행위(User Action)** + **서버 상태 변경** + **비즈니스 로직**
- 분리 완료: add-post, edit-post, add-comment, edit-comment, remove-post, like-comment, remove-comment
- 총 7개 Feature로 분리하여 단일 책임 원칙 준수

**🟡 MEDIUM (분리 검토 후 유지):**

- **post-filters**: props drilling 문제로 분리 불가능
- API 의존성이 있으나 완전한 캡슐화가 어려운 경우

**🔴 LOW (분리 불필요):**

- **순수 UI** + **정적 컨텐츠** + **단순 계산** + **GET API만 사용**
- Widget으로 유지하여 복잡성 방지

## 실제 적용 예시

**현재 프로젝트 구조:**

```
src/features/add-post/
  model/...
  ui/add-post-form.tsx   // form + react-query mutation

src/widgets/post-table/   // 단순 데이터 표 렌더링
```

**새로운 기능 추가 시나리오:**

1. **1단계:** `src/widgets/comment-like-button` (단순 버튼 + prop으로 onClick 전달)
2. **2단계:** 서버 mutation, optimistic update 등이 추가되면 `src/features/toggle-comment-like/{model,ui}`로 승급

## 최종 구조의 역할 분담

1. **shared/ui** – 원자적, 스타일 위주 컴포넌트
2. **entities** – 도메인 엔터티(데이터 타입, API 클라이언트)
3. **features** – "엔터티 × 행위" 조합, 단일 유스케이스
4. **widgets** – 여러 feature·entity·shared/ui를 배치하여 화면 블록을 구성
5. **pages** – 라우트 엔트리, SEO·레이아웃 담당

## 실행 전략

### 작업 순서

1. 우선 "데이터 모델"(`entities`)부터 잡기
2. 해당 모델을 이용해 **행위 단위**로 feature 설계
3. 레이아웃·배치를 widget에서 조립
4. 나중에 feature가 여러 곳에서 반복된다면 library 수준(`shared/lib`)으로 추출

### 결정이 어려울 때

- **가벼운 UI + 최소 로직** → Widget
- **서버 통신, 캐싱, 검증** → Feature
- **언제든 slice 이동이 쉽다** → 처음부터 완벽히 나눠야 한다는 부담을 내려놓기

## GET API는 Feature로 분리하지 않는다

### 핵심 원칙

**GET API는 Entity 레이어에서 관리하고, Feature는 실제 사용자 행위에 집중한다.**

### 판단 기준

| API 종류 | 위치 | 이유 | 예시 |
|---------|------|------|------|
| **GET** | `entities/*/api/` | 데이터 조회, 부수효과 없음 | `useGetPosts()`, `useGetUser()` |
| **POST** | `features/add-*` | 새로운 데이터 생성 행위 | `features/add-post/` |
| **PUT/PATCH** | `features/edit-*` | 기존 데이터 수정 행위 | `features/edit-comment/` |
| **DELETE** | `features/remove-*` | 데이터 삭제 행위 | `features/remove-post/` |

### 실제 적용 사례

```typescript
// ✅ 올바른 구조
entities/post/api/useGetPosts()        // 조회는 Entity
features/add-post/                     // 생성은 Feature  
widgets/post-table/                    // Entity API 직접 사용

// ❌ 잘못된 구조
features/get-posts/                    // GET을 Feature로 오해
features/fetch-user-list/              // 불필요한 추상화
```

### 이유

1. **Feature = 사용자 행위**: "무엇을 하겠다"는 명확한 의도
2. **GET = 데이터 요구**: "데이터가 필요하다"는 단순 요구사항
3. **부수효과 없음**: 시스템 상태를 변경하지 않음
4. **재사용성**: 여러 곳에서 동일한 데이터 필요

## 마무리

FSD에서 Feature와 Widget을 구분하는 핵심은 **"사용자 행위 중심"**과 **"단일 책임 원칙"** 두 축으로 판단하는 것이다. 

특히 **GET API는 Feature가 아닌 Entity에서 관리**하여 불필요한 추상화를 피하고, **실제 비즈니스 행위(POST/PUT/DELETE)만 Feature로 분리**하는 것이 FSD 철학에 부합한다.

결국 "완벽한 분리"보다는 **"명확한 책임 분리"**와 **"적절한 추상화 수준"**을 유지하는 것이 현실적인 FSD 적용 방법이라고 생각한다.

---

_작성일: 2024년_  
_프로젝트: front_6th_chapter2-3_
