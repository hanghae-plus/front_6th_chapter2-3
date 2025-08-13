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

## 마무리

FSD에서 Feature와 Widget을 구분하는 핵심은 **"기능 중심"**과 **"재사용 가능성"** 두 축으로 판단하는 것이다. UI를 어디에 배치할지 결정할 때는 컴포넌트의 책임 범위와 복잡도를 기준으로 하되, 필요에 따라 점진적으로 Feature로 승급하는 유연한 접근이 중요하다.

결국 "완벽한 분리"보다는 **"명확한 책임 분리"**와 **"유지보수 용이성"**을 우선시하는 것이 현실적인 FSD 적용 방법이라고 생각한다.

---

_작성일: 2024년_  
_프로젝트: front_6th_chapter2-3_
