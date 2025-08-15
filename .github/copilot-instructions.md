# 프론트엔드 클린코드 미션 - 코드 리뷰 가이드라인

## Auto Review 수행 지침

### 리뷰 우선순위 (High → Low)
1. **Critical**: 보안, 성능 이슈, 컴파일 에러
2. **Important**: 아키텍처, 타입 안전성, 접근성
3. **Moderate**: 코딩 컨벤션, 가독성
4. **Nice to have**: 리팩토링 제안, 최적화 아이디어

### 리뷰 응답 형식
- 각 코멘트는 **[우선순위] 카테고리: 내용** 형식으로 작성
- 예시: `[High] 보안: XSS 취약점이 있습니다`
- 코드 개선안은 반드시 예시 코드와 함께 제공

### 리뷰하지 않을 항목
- 단순 오타나 스타일 이슈 (Prettier가 처리)
- 개인 취향에 관한 사항
- 요구사항에 명시되지 않은 기능 추가 제안

## 코드 리뷰 언어 설정

**코드 리뷰를 수행할 때는 반드시 한국어로 답변해주세요. 모든 코멘트, 설명, 제안사항은 한국어로 작성해주세요.**

### 리뷰 커뮤니케이션 가이드
- 건설적이고 친근한 톤으로 피드백 제공
- 문제점 지적 시 개선 방안도 함께 제시
- 좋은 코드에 대해서는 칭찬도 포함
- 기술적 용어는 한국어와 영어를 병행 사용 (예: "컴포넌트(component)")

#### 문제 지적 시
❌ "이 코드는 잘못되었습니다"  
✅ "다음과 같이 개선하면 더 안전할 것 같아요"

#### 제안 시
❌ "이렇게 하세요"  
✅ "이런 방식은 어떨까요?"

#### 칭찬 시
✅ "타입 정의가 명확해서 좋네요!"  
✅ "접근성을 잘 고려한 구현이에요!"

## 🔥 우선순위 높음 (Critical)

### 1. 의존성 방향 검증
**규칙**: 하위 계층만 참조 가능 (app → pages → widgets → features → entities → shared)

#### ❌ 금지 패턴
```tsx
// entities에서 features 참조
import { loginUser } from 'features/auth'

// features에서 pages 참조  
import { HomePage } from 'pages/home'

// shared에서 상위 계층 참조
import { UserEntity } from 'entities/user'
```

#### ✅ 허용 패턴
```tsx
// pages에서 features 참조
import { LoginForm } from 'features/auth'

// features에서 entities 참조
import { User } from 'entities/user'

// 모든 계층에서 shared 참조
import { Button } from 'shared/ui'
```

**체크 포인트**:
- [ ] import 경로에서 상위 계층을 참조하지 않는가?
- [ ] 같은 계층 간 cross-import가 없는가?
- [ ] shared 외에는 모든 계층에서 참조되지 않는가?

---

### 2. Public API 정의 검증
**규칙**: 각 slice는 index.js를 통해서만 외부에 노출

#### ❌ 금지 패턴
```tsx
// 내부 파일 직접 참조
import { validateEmail } from 'features/auth/lib/validators'
import { UserCard } from 'entities/user/ui/UserCard'

// index.js 없이 폴더 참조
import { authSlice } from 'features/auth/model/authSlice'
```

#### ✅ 허용 패턴
```tsx
// Public API를 통한 참조
import { validateEmail, LoginForm } from 'features/auth'
import { UserCard } from 'entities/user'

// 명확한 index.js 정의
// features/auth/index.js
export { LoginForm } from './ui/LoginForm'
export { useAuth } from './model/useAuth'
export { validateEmail } from './lib/validators'
```

**체크 포인트**:
- [ ] 각 slice에 index.js가 존재하는가?
- [ ] 외부에서 내부 파일을 직접 import하지 않는가?
- [ ] index.js에서 필요한 것만 선택적으로 export하는가?

---

### 3. 비즈니스 로직 계층 배치 검증
**규칙**: 각 계층의 역할에 맞는 코드만 포함

#### ❌ 금지 패턴
```tsx
// entities에 비즈니스 로직
// entities/user/model/userModel.js
export const loginUser = async (email, password) => {
  const response = await api.post('/login', { email, password })
  localStorage.setItem('token', response.token)
  return response.user
}

// shared에 도메인 특화 로직
// shared/lib/userHelpers.js
export const calculateUserSubscriptionStatus = (user) => {
  // 구독 관련 비즈니스 로직
}
```

#### ✅ 허용 패턴
```tsx
// entities: 순수한 데이터 모델
// entities/user/model/userModel.js
export interface User {
  id: string
  email: string
  name: string
}

export const createUser = (data) => ({ ...data, id: generateId() })

// features: 비즈니스 로직
// features/auth/model/authService.js
export const loginUser = async (credentials) => {
  // 인증 관련 비즈니스 로직
}
```

**체크 포인트**:
- [ ] entities에 CRUD 외의 비즈니스 로직이 없는가?
- [ ] features에 구체적인 사용자 시나리오가 구현되어 있는가?
- [ ] shared에 도메인 특화 로직이 없는가?

---

## ⚠️ 우선순위 중간 (Important)

### 4. 단일 책임 원칙 준수
**규칙**: 하나의 컴포넌트/함수는 하나의 책임만 가져야 함

#### ❌ 금지 패턴
```tsx
// 여러 책임을 가진 컴포넌트
const UserProfile = () => {
  const [user, setUser] = useState()
  const [isEditing, setIsEditing] = useState(false)
  const [notifications, setNotifications] = useState([])
  
  // 사용자 정보 + 편집 + 알림 + 설정
  return (
    <div>
      <UserInfo user={user} />
      <EditForm user={user} isEditing={isEditing} />
      <NotificationList notifications={notifications} />
      <UserSettings user={user} />
    </div>
  )
}
```

#### ✅ 허용 패턴
```tsx
// 단일 책임으로 분리
// widgets/user-profile/ui/UserProfile.jsx
const UserProfile = ({ userId }) => {
  return (
    <div>
      <UserCard userId={userId} />
      <UserEditWidget userId={userId} />
      <UserNotificationsWidget userId={userId} />
    </div>
  )
}

// entities/user/ui/UserCard.jsx - 표시만
// features/user-edit/ui/EditWidget.jsx - 편집만
// features/notifications/ui/NotificationsWidget.jsx - 알림만
```

**체크 포인트**:
- [ ] 컴포넌트가 하나의 명확한 목적을 가지는가?
- [ ] 파일명이 해당 책임을 명확히 나타내는가?
- [ ] useState가 3개 이상 사용되지 않는가?

---

### 5. Shared 레이어 순수성 검증
**규칙**: shared는 도메인 독립적이고 재사용 가능해야 함

#### ❌ 금지 패턴
```tsx
// shared에 도메인 로직
// shared/lib/userValidators.js
export const validateUserSubscription = (user) => {
  // 사용자 구독 관련 로직
}

// shared UI에 도메인 의존
// shared/ui/UserStatusBadge.jsx
const UserStatusBadge = ({ user }) => {
  const status = user.subscriptionType === 'premium' ? 'VIP' : 'Regular'
  return <Badge>{status}</Badge>
}
```

#### ✅ 허용 패턴
```tsx
// shared: 순수한 유틸리티
// shared/lib/validators.js
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// shared UI: 도메인 독립적
// shared/ui/Badge.jsx
const Badge = ({ children, variant = 'default' }) => {
  return <span className={`badge badge-${variant}`}>{children}</span>
}
```

**체크 포인트**:
- [ ] shared 코드가 특정 도메인에 의존하지 않는가?
- [ ] shared 함수가 순수 함수인가?
- [ ] shared UI 컴포넌트가 범용적으로 사용 가능한가?

---

### 6. 상태 관리 계층 분리
**규칙**: 상태는 해당 기능의 책임 범위 내에서만 관리

#### ❌ 금지 패턴
```tsx
// 전역 스토어에 모든 상태
const globalStore = {
  users: [],
  currentUser: {},
  loginForm: { email: '', password: '' },
  userEditForm: { name: '', email: '' },
  notifications: [],
  userSettings: {}
}
```

#### ✅ 허용 패턴
```tsx
// 계층별 상태 분리
// entities/user/model/userStore.js
const userStore = {
  users: [],
  currentUser: {}
}

// features/auth/model/authStore.js  
const authStore = {
  isAuthenticated: false,
  loginForm: { email: '', password: '' }
}

// features/user-edit/model/editStore.js
const editStore = {
  editForm: { name: '', email: '' },
  isEditing: false
}
```

**체크 포인트**:
- [ ] 각 feature의 상태가 독립적으로 관리되는가?
- [ ] 전역 상태에 feature별 상태가 섞여있지 않는가?
- [ ] 상태의 스코프가 명확하게 정의되어 있는가?

## 🚀 TanStack Query 관련 추가

### 7. 쿼리 키 관리 체계화
**규칙**: 쿼리 키는 계층화되고 일관된 팩토리 패턴으로 관리

#### ❌ 금지 패턴
```tsx
// 하드코딩된 쿼리 키
const { data } = useQuery(['users'], fetchUsers)
const { data } = useQuery(['user', id], () => fetchUser(id))
const { data } = useQuery(['userPosts', userId], () => fetchUserPosts(userId))
```

#### ✅ 허용 패턴
```tsx
// shared/api/queryKeys.js
export const queryKeys = {
  all: ['api'] as const,
  users: () => [...queryKeys.all, 'users'] as const,
  user: (id: string) => [...queryKeys.users(), id] as const,
  userPosts: (userId: string) => [...queryKeys.user(userId), 'posts'] as const,
}
```

**체크 포인트**:
- [ ] 쿼리 키가 하드코딩되지 않았는가?
- [ ] 계층적 구조를 가진 팩토리 패턴을 사용하는가?
- [ ] 같은 데이터에 대해 일관된 키를 사용하는가?

### 8. TanStack Query API 계층 분리
**규칙**: API 로직은 FSD 계층에 맞게 분리

#### ❌ 금지 패턴
```tsx
// features에서 직접 axios 호출
export const useUserProfile = (id) => {
  return useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => axios.get(`/api/users/${id}`).then(res => res.data)
  })
}
```

#### ✅ 허용 패턴
```tsx
// entities/user/api/userApi.js - 순수 CRUD
export const userApi = {
  getUser: (id: string) => httpClient.get(`/users/${id}`).then(res => res.data)
}

// features/user-profile/api/profileQueries.js - 비즈니스 로직
export const useUserProfile = (userId: string) => {
  const userQuery = useUser(userId)
  const subscriptionQuery = useUserSubscription(userId)
  
  return { ...userQuery, data: userQuery.data ? { ...userQuery.data, subscription: subscriptionQuery.data } : undefined }
}
```

### 9. TanStack Query 에러 처리 표준화
**규칙**: 에러 처리는 일관된 패턴으로 중앙화

#### ✅ 허용 패턴
```tsx
// shared/api/useApiError.js
export const useApiError = () => {
  return {
    onError: (error: Error) => {
      if (error.status === 401) authStore.logout()
      else if (error.status >= 500) toast.error('서버 오류가 발생했습니다')
    }
  }
}
```

---

## 🔧 현대적인 React 패턴 (우선순위 중간)

### 10. Suspense & Error Boundary 활용
**규칙**: 비동기 상태 관리는 Suspense와 Error Boundary 활용

#### ❌ 금지 패턴
```tsx
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchUser(userId).then(setUser).catch(setError).finally(() => setLoading(false))
  }, [userId])
  
  if (loading) return <Spinner />
  if (error) return <div>Error: {error.message}</div>
  return <div>{user.name}</div>
}
```

#### ✅ 허용 패턴
```tsx
// 상위에서 Suspense + ErrorBoundary 래핑
<ErrorBoundary fallback={<ErrorFallback />}>
  <Suspense fallback={<UserProfileSkeleton />}>
    <UserProfile userId={userId} />
  </Suspense>
</ErrorBoundary>

// 컴포넌트는 성공 케이스만 처리
const UserProfile = ({ userId }) => {
  const { data: user } = useSuspenseQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => userApi.getUser(userId)
  })
  
  return <div>{user.name}</div>
}
```

### 11. 커스텀 훅 패턴
**규칙**: 비즈니스 로직은 커스텀 훅으로 분리

#### ❌ 금지 패턴
```tsx
const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [inputValue, setInputValue] = useState('')
  
  const addTodo = () => { /* 복잡한 로직 */ }
  const toggleTodo = () => { /* 복잡한 로직 */ }
  const deleteTodo = () => { /* 복잡한 로직 */ }
  const filteredTodos = todos.filter(/* 필터 로직 */)
  
  return (/* JSX */)
}
```

#### ✅ 허용 패턴
```tsx
// features/todo/model/useTodos.js
export const useTodos = () => {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  
  const addTodo = useCallback(() => { /* 로직 */ }, [])
  const toggleTodo = useCallback(() => { /* 로직 */ }, [])
  const deleteTodo = useCallback(() => { /* 로직 */ }, [])
  
  const filteredTodos = useMemo(() => 
    todos.filter(todo => filter === 'all' || todo.status === filter), [todos, filter]
  )
  
  return { todos: filteredTodos, addTodo, toggleTodo, deleteTodo, filter, setFilter }
}

// UI 컴포넌트는 단순해짐
const TodoList = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos()
  return (/* 간단한 JSX */)
}
```

---

## 📱 성능 최적화 추가 패턴

### 12. 렌더링 최적화
**규칙**: 불필요한 리렌더링 방지

#### ❌ 금지 패턴
```tsx
const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div>
      <span>{todo.title}</span>
      <button onClick={() => onToggle(todo.id)}>토글</button>
      <button onClick={() => onDelete(todo.id)}>삭제</button>
    </div>
  )
}

// 부모에서 인라인 함수 전달
const TodoList = () => {
  const [todos, setTodos] = useState([])
  return (
    <div>
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo}
          onToggle={(id) => setTodos(prev => /* 토글 로직 */)}
          onDelete={(id) => setTodos(prev => /* 삭제 로직 */)}
        />
      ))}
    </div>
  )
}
```

#### ✅ 허용 패턴
```tsx
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  return (
    <div>
      <span>{todo.title}</span>
      <button onClick={() => onToggle(todo.id)}>토글</button>
      <button onClick={() => onDelete(todo.id)}>삭제</button>
    </div>
  )
})

const TodoList = () => {
  const [todos, setTodos] = useState([])
  
  const handleToggle = useCallback((id) => {
    setTodos(prev => /* 토글 로직 */)
  }, [])
  
  const handleDelete = useCallback((id) => {
    setTodos(prev => /* 삭제 로직 */)
  }, [])
  
  return (
    <div>
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
```

### 13. 코드 스플리팅 & 동적 임포트
**규칙**: 번들 크기 최적화를 위한 지연 로딩

#### ❌ 금지 패턴
```tsx
import AdminPanel from './AdminPanel'
import UserDashboard from './UserDashboard'
import GuestView from './GuestView'

const App = () => {
  const { user } = useAuth()
  
  if (user?.role === 'admin') return <AdminPanel />
  if (user) return <UserDashboard />
  return <GuestView />
}
```

#### ✅ 허용 패턴
```tsx
const AdminPanel = lazy(() => import('./AdminPanel'))
const UserDashboard = lazy(() => import('./UserDashboard'))
const GuestView = lazy(() => import('./GuestView'))

const App = () => {
  const { user } = useAuth()
  
  return (
    <Suspense fallback={<PageSkeleton />}>
      {user?.role === 'admin' && <AdminPanel />}
      {user && user.role !== 'admin' && <UserDashboard />}
      {!user && <GuestView />}
    </Suspense>
  )
}
```

## 자동 검증 가능한 체크포인트

### 파일 구조 체크
- [ ] 컴포넌트가 올바른 폴더에 위치 (`components/ui/`, `features/` 등)
- [ ] `index.ts` 파일에서 적절히 re-export
- [ ] 파일명이 kebab-case 또는 PascalCase 규칙 준수

### 코드 패턴 체크
- [ ] `useState<any>()` 사용 → 구체적 타입 정의 요구
- [ ] `// @ts-ignore` 사용 → 대안 제시
- [ ] 하드코딩된 스타일 → Tailwind 클래스 사용 권장
- [ ] 200줄 이상 컴포넌트 → 분리 제안

### TypeScript 체크
- [ ] `any` 타입 사용 최소화
- [ ] 적절한 인터페이스 정의
- [ ] Optional vs Required props 명확히 구분
- [ ] Enum 대신 Union Type 사용 권장

## 실무 품질 체크

### UX/성능 관련
- 로딩 상태가 적절히 표시되는가?
- 에러 상태 처리가 되어있는가?
- 접근성(screen reader, 키보드 내비게이션)이 고려되었는가?
- 무한 스크롤/페이지네이션에서 성능 이슈는 없는가?

### 유지보수성
- 매직 넘버/문자열이 상수로 관리되는가?
- 반복되는 로직이 hook이나 유틸로 추출되었는가?
- 컴포넌트가 단일 책임을 가지는가?

### 성능 체크리스트

#### 렌더링 성능
- [ ] 불필요한 리렌더 방지
- [ ] 적절한 메모이제이션 적용
- [ ] 대용량 리스트는 가상화 고려

#### 번들 사이즈
- [ ] 불필요한 의존성 제거
- [ ] 동적 import 사용
- [ ] 트리 쉐이킹 최적화

#### 접근성(a11y)
- [ ] 시맨틱 HTML 사용
- [ ] 적절한 aria 속성 추가
- [ ] 키보드 내비게이션 지원

### 보안 고려사항
- [ ] XSS 방지를 위한 데이터 정제
- [ ] 클라이언트에서 민감 정보 노출 방지
- [ ] HTTPS 사용 강제
- [ ] 의존성 보안 취약점 정기 점검

## 클린코드 미션 평가 기준

### 코드 가독성 (25점)
- [ ] 함수/변수명이 의도를 명확히 표현
- [ ] 적절한 주석 (why, not what)
- [ ] 일관된 코딩 스타일
- [ ] 복잡한 로직의 단순화

### 구조화 (25점)
- [ ] 관심사 분리가 잘 되어있음
- [ ] 적절한 추상화 레벨
- [ ] 모듈 간 결합도가 낮음
- [ ] 폴더 구조가 논리적

### 재사용성 (25점)
- [ ] 공통 컴포넌트/훅 활용
- [ ] 확장 가능한 구조
- [ ] 설정 가능한 옵션 제공
- [ ] DRY 원칙 준수

### 테스트 가능성 (25점)
- [ ] 순수 함수 사용
- [ ] 의존성 주입 활용
- [ ] 테스트하기 어려운 코드 분리
- [ ] Mock 가능한 구조

## 리뷰 체크리스트

### 필수 체크 (Critical & Important)
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 적절한 타입 정의
- [ ] 성능 최적화 고려
- [ ] 접근성 준수
- [ ] 보안 이슈 없음

### 권장 사항 (Moderate & Nice to have)
- [ ] 코드 재사용성 고려
- [ ] 적절한 에러 핸들링
- [ ] 로딩 상태 관리
- [ ] 사용자 경험 개선
- [ ] 문서화 (JSDoc 등)
