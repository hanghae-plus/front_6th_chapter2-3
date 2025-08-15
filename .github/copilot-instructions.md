# FSD 아키텍처 코드리뷰 지침

## 🔥 우선순위 높음 (Critical)

### 1. 의존성 방향 검증
**규칙**: 하위 계층만 참조 가능 (app → pages → widgets → features → entities → shared)

#### ❌ 금지 패턴
```javascript
// entities에서 features 참조
import { loginUser } from 'features/auth'

// features에서 pages 참조  
import { HomePage } from 'pages/home'

// shared에서 상위 계층 참조
import { UserEntity } from 'entities/user'
```

#### ✅ 허용 패턴
```javascript
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
```javascript
// 내부 파일 직접 참조
import { validateEmail } from 'features/auth/lib/validators'
import { UserCard } from 'entities/user/ui/UserCard'

// index.js 없이 폴더 참조
import { authSlice } from 'features/auth/model/authSlice'
```

#### ✅ 허용 패턴
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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

## 🚀 TanStack Query 관련 추가 (우선순위 높음)

### 7. 쿼리 키 관리 체계화
**규칙**: 쿼리 키는 계층화되고 일관된 팩토리 패턴으로 관리

#### ❌ 금지 패턴
```javascript
// 하드코딩된 쿼리 키
const { data } = useQuery(['users'], fetchUsers)
const { data } = useQuery(['user', id], () => fetchUser(id))
const { data } = useQuery(['userPosts', userId], () => fetchUserPosts(userId))
```

#### ✅ 허용 패턴
```javascript
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
```javascript
// features에서 직접 axios 호출
export const useUserProfile = (id) => {
  return useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => axios.get(`/api/users/${id}`).then(res => res.data)
  })
}
```

#### ✅ 허용 패턴
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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
