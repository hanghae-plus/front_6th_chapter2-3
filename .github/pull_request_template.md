## 과제 체크포인트

### 기본과제

#### 목표 : 전역상태관리를 이용한 적절한 분리와 계층에 대한 이해를 통한 FSD 폴더 구조 적용하기

- 전역상태관리를 사용해서 상태를 분리하고 관리하는 방법에 대한 이해
- Context API, Jotai, Zustand 등 상태관리 라이브러리 사용하기
- FSD(Feature-Sliced Design)에 대한 이해
- FSD를 통한 관심사의 분리에 대한 이해
- 단일책임과 역할이란 무엇인가?
- 관심사를 하나만 가지고 있는가?
- 어디에 무엇을 넣어야 하는가?

#### 체크포인트

- [ ] 전역상태관리를 사용해서 상태를 분리하고 관리했나요?
- [ ] Props Drilling을 최소화했나요?
- [ ] shared 공통 컴포넌트를 분리했나요?
- [ ] shared 공통 로직을 분리했나요?
- [ ] entities를 중심으로 type을 정의하고 model을 분리했나요?
- [ ] entities를 중심으로 ui를 분리했나요?
- [ ] entities를 중심으로 api를 분리했나요?
- [ ] feature를 중심으로 사용자행동(이벤트 처리)를 분리했나요?
- [ ] feature를 중심으로 ui를 분리했나요?
- [ ] feature를 중심으로 api를 분리했나요?
- [ ] widget을 중심으로 데이터를 재사용가능한 형태로 분리했나요?

### 심화과제

#### 목표: 서버상태관리 도구인 TanstackQuery를 이용하여 비동기코드를 선언적인 함수형 프로그래밍으로 작성하기

- TanstackQuery의 사용법에 대한 이해
- TanstackQuery를 이용한 비동기 코드 작성에 대한 이해
- 비동기 코드를 선언적인 함수형 프로그래밍으로 작성하는 방법에 대한 이해

#### 체크포인트

- [ ] 모든 API 호출이 TanStack Query의 useQuery와 useMutation으로 대체되었는가?
- [ ] 쿼리 키가 적절히 설정되었는가?
- [ ] fetch와 useState가 아닌 선언적인 함수형 프로그래밍이 적절히 적용되었는가?
- [ ] 캐싱과 리프레시 전략이 올바르게 구현되었는가?
- [ ] 낙관적인 업데이트가 적용되었는가?
- [ ] 에러 핸들링이 적절히 구현되었는가?
- [ ] 서버 상태와 클라이언트 상태가 명확히 분리되었는가?
- [ ] 코드가 간결하고 유지보수가 용이한 구조로 작성되었는가?
- [ ] TanStack Query의 Devtools가 정상적으로 작동하는가?

### 최종과제

- [ ] 폴더구조와 나의 멘탈모데일이 일치하나요?
- [ ] 다른 사람이 봐도 이해하기 쉬운 구조인가요?

## 과제 셀프회고

### 이번 과제를 통해 이전에 비해 새롭게 알게 된 점이 있다면 적어주세요.

### 본인이 과제를 하면서 가장 애쓰려고 노력했던 부분은 무엇인가요?

아래는 fsd 작업 진행 순서입니다. 각 레이어를 구분하면서 고민했던 내용을 함께 정리해 보았아요.

<details>
<summary>1. shared 레이어</summary>
가장 먼저 나누기(리팩토링) 쉬운 폴더가 shared라고 선택하여 제일 먼저 정의하고 작업을 시작헀습니다.
작업 전 FSD 공식문서와 발제 자료를 확인하여 shared의 의의를 먼저 정의해보았습니다.

```ts
## shared 구성 (최하위)

1. User, API 응답과 같은 여러 레이어에 공유되는 정보를 담는다.
2. 내부 폴더 이름은 목적이 명확해야 한다. components, hooks, types같은 모호한 이름은 사용하지 않는다.
3. 공통으로 사용되는 유틸리티와 UI 컴포넌트를 담는다.
4. shared 내부에서 shared 레이어 공유 가능하다.
5. shared 폴더는 도메인(slices) 폴더가 없다. segment로만 이루어져있다.
```

`/src/components/index.tsx` 내부에 나열되어있는 ui들을 shared 레이어 내부로 정리했습니다. 딱 보기에도 input, button과 같은 공용 컴포넌트스럽고 빠로 비즈니스 로직이 없는 친구들이었습니다.

Button이나 Input의 경우는 단일 컴포넌트로 이루어져 고민이 없었는데, Select나 Card의 경우 이름이 비슷하지만 컴파운트 패턴처럼 필요한 곳에 필요한 컴포넌트만 불러와 사용할 수 있는 ui들이 많아 Card, CardHeader, CardContent처럼 각각 파일명으로 분리할까 고민이 되었습니다.
하지만 Card라는 하나의 ui로 이루어질 것으로 예상되어 분리하기보다 관심사를 통일하여 한 곳에 관리하는게 좋다고 판단되었습니다. props타입도 index.ts에 각각 export하기도 번거롭기도 하구요!
그래서 Card.tsx, Select.tsx, ... 에서 작은 ui들을 index.ts하나로 묶어서 export하였습니다.

타입지정시 cva라이브러리를 사용하여 테일윈드의 className을 정리할지, 아니면 기존 className을 그대로 둔 채 단순한 타입을 선언해줄지 고민이었습니다. 이 부분은 평소에 실무에서도 시도해보지 못한 부분이니 cva를 사용하여 안전하며 선언적이고 명확한 구조로 테일윈드의 장점이 더욱 돋보이도록 오버엔지니어링을 시도해보았습니다.

</details>

<details>

<summary>2. pages 레이어</summary>

기존의 `pages` 레이어 내부의 PostsManagerPage.tsx컴포넌트를 이동시켰습니다.
pages 내부에서 slices를 고민할 때 post와 postManager중에 고민했는데, post는 좀 더 명확한 도메인의 느낌이고 postManager는 managing의 기능적인 느낌이 들어서 post로 선택했습니다.
pages는 말 그대로 ui의 집합, 컴포넌트들의 집합인 **페이지**를 보여주어야한다고 생각해 나머지 도메인 로직을 포함하고있는 기능단위의 컴포넌트들을 features 레이어로 분리했습니다.

</details>

<details>
<summary>3. entities 레이어</summary>

```ts
## entities 구성

1. 핵심 데이터 구조와 상태 관리를 담는다. ex. Product model, User model, Order model, Review model
2. 핵심 데이터를 CRUD하는 API request function을 구성한다. (api)
3. 여러 page에서 재사용이 가능한 엔티티 interface들도 구성될 수 있다.
4. 단순한 데이터 구조 뿐만 아니라 비즈니스 로직을 포함한다. ex. User 엔티티의 경우엔 login, signup을 포함
```

entities 레이어에는 data를 fetch하는 api function로직을 구성하거나, 해당 data의 interface를 정의하고, 데이터와 관련 로직을 제공합니다.
먼저 entities 레이어에 기존 PostsManagerPage에서 사용중인 api fetch function들을 옮겨왔습니다. 페이지를 구성하는 핵심 api이며 이 기준에서 핵심 데이터들은 다음과 같았습니다. 게시물, 댓글, 사용자.
모두 옮기고나니 고민이 생겼습니다. entities/데이터 슬라이스 내부의 api 세그먼트에 데이터보다 **비즈니스 로직스러운** 코드가 있지는 않은가?
처음에 생각했던 방향은 entities는 데이터의 집합이니 api내부에 데이터 fetch하는 로직을 모두 넣어야겠다고 생각했는데 feature나 ui의 세그먼트 비즈니스 로직에서 참조할 것 같아 api는 단순한 데이터를 가져오는 로직만 남기고 feature의 model로 분리하는 것이 낫다고 생각되었습니다.

1차 결론,
entities/데이터/api -> GET response, request만 정의
features/데이터/api -> GET 외 기타 response, request 정의

이렇게 분리하고 나니 다시 고민이 생겼습니다.
ui입장에서 api가 한 곳에서 import되지 않으면 ui입장에서 다음과 같이 분리될텐데 이상하지 않을까?

```ts
import { getUsers } from "entities/users"
import { createUser } from "features/users"
```

그래서 entities에서 해결 할 수 있는 방법을 고민했습니다. entities/users/api에는 GET api fetch로직과 types를 남긴다 -> entities/users/api에 들어가지 않는 WRITE fetch 로직들은 그럼 어디에 넣을까?를 고민해보니 비즈니스 로직을 담는 model 세그먼트가 생각났습니다.
적극적으로 해당 내용을 반영했고 다음과 같은 효과를 기대해볼 수 있습니다.

- entities/users로 일관성이 있음 ✅
- 응집도도 높아짐 ✅
- features에 model 세그먼트에 대한 고민도 불필요 ✅

2차 결론,
entities/데이터/api -> GET response, request정의
entities/데이터/model -> GET 외 기타 response, request 정의

</details>

<details>
<summary>4. widgets & feeatures 레이어</summary>

처음에 features와 widgets의 경계가 모호하여 동료들에게 많이 물어보고 fsd관련된 포스팅도 참고해보았으나 제 기준을 명확히 잡고 가는 것이 좋다고 생각했습니다.
초기에 features가 아닌 widgets에 dialog와 table 등 도메닝과 관련된 ui들을 모두 옮겨놓았습니다.
요구 사항에 **widget을 중심으로 데이터를 재사용가능한 형태로 분리했나요?**라는 부분이 있어 그럼 데이터를 받아서 사용하는 컴포넌트들은 모두 widgets으로 보내야한다고 생각했습니다.
하지만,
하나씩 ui를 리팩토링하고 컴포넌트로 분리하면서 page에 상태와 도메인 비즈니스 로직이 남았을때 이상함을 느꼈습니다. 비즈니스 로직은 features 레이어에 구성되는게 맞는 것 같은데 해당 비즈니스 로직을 사용하는 곳은 widgets으로 그러면 해당 컴포넌트들을 ui 묶음 단위보다 도메인 기능성 단위로 보는게 자연스러웠습니다.
게다가 곰곰히 생각해보니 header,footer,pagination은 ui라이브러리에서도 흔히 보이는 공용 컴포넌트인데, dialog 프레임이 아닌 이상 add-도메인-dialog와 같은 컴포넌트들은 이름에서조차 '기능' 단위가 더 강했습니다.
과감히 모든 컴포넌트들을 features로 옮기고 비즈니스 로직도 함께 나란히 구성 할 수 있게되었습니다.

</details>

<details>
<summary>그 외 기타 고민</summary>

**page에서 사용중인 가공된 데이터 타입**

```ts
export interface PostCommentsObj {
  [key: number]: Array<Comments>
}

export interface PostsWithUsers extends Post {
  author?: Users | undefined
}
```

PostsManagerPage.tsx에서 entities의 데이터 타입을 그대로 사용하는 것이 아닌 ui구성에 필요한 다른 형태로 추가 가공해서 사용 중입니다.
실무에서라면 author 데이터도 Post 데이터에 함께 담겨저 올테지만 더미 API이니... 어쩔수 없이 제가 해결해야합니다.🥲
pages에서 가져온 데이터를 widgets 레이어의 컴포넌트도 사용해야하는데 pages에 선언된 타입을 import해서 사용하려다보니 레이어 의존성 규칙에 위반되었습니다.
그래서 타입을 widgets에 있는 사용중인 컴포넌트로 옮겼습니다. pages에서의 레이어 의존성 규칙을 해결했습니다.
page 레이어에서는 단순한 page의 기능만 두고 다른 레이어들에게 기능(타입, 로직 등등)을 위임하는 것이 명확해야할 것 같습니다.

</details>

### 아직은 막연하다거나 더 고민이 필요한 부분을 적어주세요.

전역상태를 이용해서 props drilling을 정리해보았습니다. 정말 컴포넌트만 남기니 깔끔하고 속이 뻥 뚫릴 정도로 시원해졌으나, 코치님이 얘기해주신대로 어떤 컴포넌트가 어떤 상태값과 어떤 액션을 취할 수 있는지 판단이 힘들었습니다. 내부 로직을 개선해야할때면 props drilling때와 마찬가지로 내부에 들어가거나 관련된 hook이나 액션을 찾아야 로직 파악이 가능했었습니다.
그래서 이 부분에 있어서는 꼭 props drilling이 나쁜것인가? 라고 했을때 아니다라고 자신있게 얘기할 수 있을 것 같습니다.
공용 컴포넌트에 전달하는 props들처럼 해당 컴포넌트를 위한 ui props만 무조건 사용해야하나? 라고 했을때도 아니다라고 얘기할 수 있을 것 같습니다.
과제를 진행하면서 얼마나 응집도가 높아야하는지 느껴본 시간이었던 것 같고, 이 높은 응집도를 위해서는 정말 많은 시간과 노력이 필요하구나.. 단 일주일 이었지만 이 작은 프로젝트에도 리팩토링하기엔 너무나도 부족한 시간이었고 fsd가 과연 좋은 패턴일까에 대한 고민도 많았습니다.
실무에서 직접 fsd를 적용해보면서 여러 도메인에서는 어떤 패턴이 나을지 부딛혀보는 수밖에 없을 것 같아 이번 배움은 이정도면 충분한 것 같다고 느낍니다!

그리고 리팩토링을 위해 useState를 모두 전역 상태값으로 빼야하는가? 를 많이 고민했던 것 같습니다. selectedPost같은 ui에서 사용하는 가공된 데이터 값을 전역 상태값으로 넣자니 공용 데이터도 아닌 것이 그렇다고 ui를 위한 상태 값도 아니니 props로 전달하기가 애매했습니다.

### 이번에 배운 내용 중을 통해 앞으로 개발에 어떻게 적용해보고 싶은지 적어주세요.

커스텀 훅을 다양하게 사용하고 이 보다 더러운 코드는 없을테니 많은 양의 코드를 보는 눈썰미가 길러졌을 것 같다 라는 긍정적인 생각이 들었습니다!

## 챕터 셀프회고

> 클린코드와 아키테쳑 챕터 함께 하느라 고생 많으셨습니다!
> 지난 3주간의 여정을 돌이켜 볼 수 있도록 준비해보았습니다.
> 아래에 적힌 질문들은 추억(?)을 회상할 수 있도록 도와주려고 만든 질문이며, 꼭 질문에 대한 대답이 아니어도 좋으니 내가 느꼈던 인사이트들을 자유롭게 적어주세요.

### 클린코드: 읽기 좋고 유지보수하기 좋은 코드 만들기

- 더티코드를 접했을 때 어떤 기분이었나요? ^^; 클린코드의 중요성, 읽기 좋은 코드란 무엇인지, 유지보수하기 쉬운 코드란 무엇인지에 대한 생각을 공유해주세요

### 결합도 낮추기: 디자인 패턴, 순수함수, 컴포넌트 분리, 전역상태 관리

- 거대한 단일 컴포넌트를 봤을때의 느낌! 처음엔 막막했던 상태관리, 디자인 패턴이라는 말이 어렵게만 느껴졌던 시절, 순수함수로 분리하면서 "아하!"했던 순간, 컴포넌트가 독립적이 되어가는 과정에서의 깨달음을 들려주세요

### 응집도 높이기: 서버상태관리, 폴더 구조

- "이 코드는 대체 어디에 둬야 하지?"라고 고민했던 시간, FSD를 적용해보면서의 느낌, 나만의 구조를 만들어가는 과정, TanStack Query로 서버 상태를 분리하면서 느낀 해방감(?)등을 공유해주세요

## 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문

#### page 내부의 useEffect

```ts
// URL 동기화를 위한 useEffect
useEffect(() => {
  updateURL()
}, [skip, limit, sortBy, sortOrder, selectedTag])

// URL 파라미터 초기화
useEffect(() => {
  const params = new URLSearchParams(location.search)
  setSkip(parseInt(params.get("skip") || "0"))
  setLimit(parseInt(params.get("limit") || "10"))
  setSearchQuery(params.get("q") || "")
  setSortBy(params.get("sortBy") || "")
  setSortOrder(params.get("sortOrder") || "asc")
  setSelectedTag(params.get("tag") || "")
}, [location.search, setSkip, setLimit, setSearchQuery, setSortBy, setSortOrder, setSelectedTag])
```

보통의 useEffect는 해당 의존성배열 값들이 사용되는 컴포넌트로 분리하여 사용하였는데 이번에는 파라미터를 가져와서 세팅하는 부분이다보니 page가 맞는가..? 그렇다고 router영역은 아닌거 같고, 내부 컴포넌트로 가져가는 것도 아닌것 같다는 생각이 들어 PostsManagerPage에 그대로 두었습니다.
어떻게 개선하면 좋았을지 궁금합니다.

#### page 내부의 게시물 상세

```ts
   {/* 게시물 상세 보기 대화상자 */}
    <PostDetailDialog children={<CommentList />} />
```

해당 코드를 보면 내부에 children으로 컴포넌트를 전달하고 있습니다. 외부에 한번 더 감싸서 감출지 혹은 PostDetailDialog내부에 넣지 말고 PostDetailDialog를 풀어놓고 내부 CommentList만 컴포넌트화 할지 고민이었는데 가장 보기 편한 방법이 이 방법인 것 같아서 children으로 props를 받는 방법을 선택했습니다.
막상 children으로 받고 나니 features/ui 내부에 features/ui를 children으로 받는 형태여서 features/ui내부에 widgets/ui를 받는게 낫지않았을까.. 라는 생각도 들었습니다.
어떤 더 나은 방법이 있을지 궁금합니다.
