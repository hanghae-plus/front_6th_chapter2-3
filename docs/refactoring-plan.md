# 클린 코드 리팩토링 계획서

## 전략 개요

### 리팩토링 원칙

- **점진적 개선**: 한 번에 하나씩, 작은 단위로 개선
- **안정성 우선**: 기능 변경 없이 구조만 개선
- **영향도 최소화**: 변경 범위를 최소화하여 리스크 감소
- **우선순위 기반**: 효과 대비 비용이 낮은 작업부터 시작

### 리팩토링 매트릭스

| 우선순위 | 영향도  | 작업 유형        | 예상 시간 |
| -------- | ------- | ---------------- | --------- |
| 🔥 최고  | 🟢 낮음 | 매직넘버, 상수화 | 1-2시간   |
| 🔥 최고  | 🟡 중간 | 타입 정의        | 3-4시간   |
| 🔴 높음  | 🟢 낮음 | 네이밍 통일      | 2-3시간   |
| 🔴 높음  | 🟡 중간 | 함수 분리        | 4-6시간   |
| 🟡 중간  | 🟡 중간 | 컴포넌트 분리    | 8-12시간  |
| 🟡 중간  | 🔴 높음 | 상태 관리 개선   | 12-16시간 |

## Phase 1: 기초 정리 (영향도 낮음, 우선순위 높음)

### 1.1 매직 넘버 및 상수 정리 ⏱️ 1-2시간

**영향도**: 🟢 매우 낮음 | **우선순위**: 🔥 최고 | **난이도**: ⭐

#### 작업 내용

```typescript
// ❌ Before
<Textarea rows={30} />
<Textarea rows={15} />
const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'));

// ✅ After
const TEXTAREA_ROWS = {
  LARGE: 30,
  MEDIUM: 15,
  SMALL: 5,
} as const;

const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_SKIP: 0,
  LIMITS: [10, 20, 30] as const,
} as const;

const API_ENDPOINTS = {
  POSTS: '/api/posts',
  COMMENTS: '/api/comments',
  USERS: '/api/users',
  TAGS: '/api/posts/tags',
} as const;
```

#### 체크리스트

- [ ] `src/shared/constants/index.ts` 파일 생성
- [ ] 모든 매직 넘버 식별 및 상수로 추출
- [ ] API 엔드포인트 상수화
- [ ] 페이지네이션 관련 상수 정의
- [ ] UI 관련 상수 (textarea rows, 버튼 크기 등) 정의

---

### 1.2 TypeScript 타입 정의 ⏱️ 3-4시간

**영향도**: 🟡 중간 | **우선순위**: 🔥 최고 | **난이도**: ⭐⭐

#### 작업 내용

```typescript
// src/shared/types/index.ts
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  author?: User;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  userId: number;
  user: {
    id: number;
    username: string;
  };
  likes: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  image: string;
  address: {
    address: string;
    city: string;
    state: string;
  };
  company: {
    name: string;
    title: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  posts?: T[];
  users?: T[];
  comments?: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface PaginationParams {
  skip: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  tag?: string;
}
```

#### 체크리스트

- [ ] `src/shared/types/index.ts` 파일 생성
- [ ] Post, Comment, User 인터페이스 정의
- [ ] API 응답 타입 정의
- [ ] 쿼리 파라미터 타입 정의
- [ ] 기존 useState 타입 적용

---

## Phase 2: 네이밍 및 함수 정리 (영향도 낮음-중간)

### 2.1 네이밍 규칙 통일 ⏱️ 2-3시간

**영향도**: 🟢 낮음 | **우선순위**: 🔴 높음 | **난이도**: ⭐

#### 작업 내용

```typescript
// ❌ Before
const openPostDetail = post => {};
const showAddDialog = false;
const newPost = {};
const selectedPost = null;

// ✅ After - Clean Code 네이밍 패턴 적용
const displayPostDetail = (post: Post) => {};
const isAddDialogVisible = false;
const draftPost: Partial<Post> = {};
const currentSelectedPost: Post | null = null;
```

#### 네이밍 규칙

```typescript
// 액션 함수 패턴
const fetchPosts = () => {}; // 조회: fetch~, get~
const createPost = () => {}; // 생성: create~, add~
const updatePost = () => {}; // 수정: update~, modify~
const deletePost = () => {}; // 삭제: delete~, remove~
const displayModal = () => {}; // 표시: display~, show~
const hideModal = () => {}; // 숨김: hide~, close~

// 상태 변수 패턴
const isLoading = false; // boolean: is~, has~, can~
const currentPage = 1; // 현재값: current~
const selectedItems = []; // 선택된: selected~
const draftData = {}; // 임시: draft~, temp~
const totalCount = 0; // 수량: total~, count~
```

#### 체크리스트

- [ ] 모든 함수명을 Clean Code 패턴으로 변경
- [ ] boolean 변수는 is/has/can 접두사 사용
- [ ] 상태 변수는 의미 명확한 이름으로 변경
- [ ] 일관된 동사 사용 (fetch, create, update, delete)

---

### 2.2 작은 함수로 분리 ⏱️ 4-6시간

**영향도**: 🟡 중간 | **우선순위**: 🔴 높음 | **난이도**: ⭐⭐

#### 작업 내용

```typescript
// ❌ Before - 92줄의 거대한 fetchPosts 함수
const fetchPosts = () => {
  setLoading(true);
  let postsData;
  let usersData;

  fetch(`/api/posts?limit=${limit}&skip=${skip}`)
    .then(response => response.json())
    .then(data => {
      postsData = data;
      return fetch('/api/users?limit=0&select=username,image');
    })
    .then(response => response.json())
    .then(users => {
      usersData = users.users;
      const postsWithUsers = postsData.posts.map(post => ({
        ...post,
        author: usersData.find(user => user.id === post.userId),
      }));
      setPosts(postsWithUsers);
      setTotal(postsData.total);
    })
    .catch(error => {
      console.error('게시물 가져오기 오류:', error);
    })
    .finally(() => {
      setLoading(false);
    });
};

// ✅ After - 작은 함수들로 분리 (각각 20줄 이하)
const fetchPostsData = async (params: PaginationParams): Promise<ApiResponse<Post>> => {
  const queryString = createQueryString(params);
  const response = await fetch(`${API_ENDPOINTS.POSTS}?${queryString}`);
  if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status}`);
  return response.json();
};

const fetchUsersData = async (): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_ENDPOINTS.USERS}?limit=0&select=username,image`);
  if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
  return response.json();
};

const mergePostsWithAuthors = (posts: Post[], users: User[]): Post[] => {
  return posts.map(post => ({
    ...post,
    author: users.find(user => user.id === post.userId),
  }));
};

const createQueryString = (params: PaginationParams): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
};

const fetchPosts = async () => {
  try {
    setIsLoading(true);

    const [postsResponse, usersResponse] = await Promise.all([
      fetchPostsData({ skip, limit }),
      fetchUsersData(),
    ]);

    const postsWithAuthors = mergePostsWithAuthors(
      postsResponse.posts || [],
      usersResponse.users || []
    );

    setPosts(postsWithAuthors);
    setTotal(postsResponse.total);
  } catch (error) {
    handleApiError(error, 'fetchPosts');
  } finally {
    setIsLoading(false);
  }
};
```

#### 체크리스트

- [ ] 20줄 이상인 모든 함수 식별
- [ ] 각 함수를 단일 책임으로 분리
- [ ] API 호출 로직 분리
- [ ] 데이터 변환 로직 분리
- [ ] 에러 처리 로직 분리
- [ ] Promise.all을 활용한 병렬 처리 적용

---

## Phase 3: 로직 분리 (영향도 중간)

### 3.1 에러 처리 표준화 ⏱️ 2-3시간

**영향도**: 🟡 중간 | **우선순위**: 🔴 높음 | **난이도**: ⭐⭐

#### 작업 내용

```typescript
// src/shared/utils/error-handler.ts
export interface ApiError {
  message: string;
  status?: number;
  context?: string;
}

export const createApiError = (error: unknown, context: string): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      context,
      status: (error as any).status,
    };
  }

  return {
    message: 'Unknown error occurred',
    context,
  };
};

export const handleApiError = (error: unknown, context: string): void => {
  const apiError = createApiError(error, context);

  // 콘솔 로깅
  console.error(`[${apiError.context}] ${apiError.message}`, apiError);

  // 사용자에게 알림 (추후 토스트 시스템으로 대체)
  alert(`오류가 발생했습니다: ${apiError.message}`);

  // 에러 모니터링 서비스로 전송 (추후 Sentry 등)
  // sendErrorToMonitoring(apiError);
};
```

#### 체크리스트

- [ ] `src/shared/utils/error-handler.ts` 생성
- [ ] 모든 try-catch를 표준 에러 핸들러로 교체
- [ ] API 에러 타입 정의
- [ ] 사용자 친화적 에러 메시지 표시

---

### 3.2 API 클라이언트 표준화 ⏱️ 3-4시간

**영향도**: 🟡 중간 | **우선순위**: 🔴 높음 | **난이도**: ⭐⭐

#### 작업 내용

```typescript
// src/shared/api/client.ts
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL = '', defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  private async request<T>(url: string, config: RequestConfig): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: config.method,
      headers: { ...this.defaultHeaders, ...config.headers },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    return this.request<T>(url, { method: 'POST', body: data });
  }

  async put<T>(url: string, data: unknown): Promise<T> {
    return this.request<T>(url, { method: 'PUT', body: data });
  }

  async patch<T>(url: string, data: unknown): Promise<T> {
    return this.request<T>(url, { method: 'PATCH', body: data });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// src/shared/api/posts.ts
export const postsApi = {
  async fetchPosts(params: PaginationParams): Promise<ApiResponse<Post>> {
    const queryString = createQueryString(params);
    return apiClient.get(`${API_ENDPOINTS.POSTS}?${queryString}`);
  },

  async fetchPostById(id: number): Promise<Post> {
    return apiClient.get(`${API_ENDPOINTS.POSTS}/${id}`);
  },

  async createPost(post: Partial<Post>): Promise<Post> {
    return apiClient.post(`${API_ENDPOINTS.POSTS}/add`, post);
  },

  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    return apiClient.put(`${API_ENDPOINTS.POSTS}/${id}`, post);
  },

  async deletePost(id: number): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.POSTS}/${id}`);
  },

  async searchPosts(query: string): Promise<ApiResponse<Post>> {
    return apiClient.get(
      `${API_ENDPOINTS.POSTS}/search?q=${encodeURIComponent(query)}`
    );
  },

  async fetchPostsByTag(tag: string): Promise<ApiResponse<Post>> {
    return apiClient.get(
      `${API_ENDPOINTS.POSTS}/tag/${encodeURIComponent(tag)}`
    );
  },
};
```

#### 체크리스트

- [ ] `src/shared/api/client.ts` 생성
- [ ] `src/shared/api/posts.ts`, `comments.ts`, `users.ts` 생성
- [ ] 모든 fetch 호출을 API 클라이언트로 교체
- [ ] API 응답 타입 적용

---

## Phase 4: 컴포넌트 분리 (영향도 중간-높음)

### 4.1 렌더링 함수 분리 ⏱️ 4-6시간

**영향도**: 🟡 중간 | **우선순위**: 🟡 중간 | **난이도**: ⭐⭐⭐

#### 작업 내용

```typescript
// ❌ Before - 거대한 return 문
return (
  <Card className='w-full max-w-6xl mx-auto'>
    {/* 200줄의 복잡한 JSX */}
  </Card>
);

// ✅ After - 작은 컴포넌트들로 분리
const PostsManagerPage = () => {
  return (
    <PostsManagerLayout>
      <PostsManagerHeader />
      <PostsSearchAndFilters />
      <PostsTable />
      <PostsPagination />
      <PostsDialogManager />
    </PostsManagerLayout>
  );
};

// src/pages/PostsManagerPage/components/PostsManagerHeader.tsx
const PostsManagerHeader = () => {
  const { openAddDialog } = usePostsDialog();

  return (
    <CardHeader>
      <CardTitle className='flex items-center justify-between'>
        <span>게시물 관리자</span>
        <Button onClick={openAddDialog}>
          <Plus className='w-4 h-4 mr-2' />
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  );
};

// src/pages/PostsManagerPage/components/PostsSearchAndFilters.tsx
const PostsSearchAndFilters = () => {
  const { searchQuery, setSearchQuery, handleSearch } = usePostsSearch();
  const { selectedTag, setSelectedTag, tags } = usePostsTags();
  const { sortBy, setSortBy, sortOrder, setSortOrder } = usePostsSort();

  return (
    <div className='flex gap-4'>
      <PostsSearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
      />
      <PostsTagFilter
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        tags={tags}
      />
      <PostsSortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />
    </div>
  );
};
```

#### 체크리스트

- [ ] PostsManagerHeader 컴포넌트 분리
- [ ] PostsSearchAndFilters 컴포넌트 분리
- [ ] PostsTable 컴포넌트 분리
- [ ] PostsPagination 컴포넌트 분리
- [ ] PostsDialogManager 컴포넌트 분리
- [ ] 각 컴포넌트별 파일 생성

---

### 4.2 커스텀 훅 분리 ⏱️ 6-8시간

**영향도**: 🟡 중간 | **우선순위**: 🟡 중간 | **난이도**: ⭐⭐⭐

#### 작업 내용

```typescript
// src/pages/PostsManagerPage/hooks/usePostsManager.ts
export const usePostsManager = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async (params: PaginationParams) => {
    try {
      setIsLoading(true);
      const [postsResponse, usersResponse] = await Promise.all([
        postsApi.fetchPosts(params),
        usersApi.fetchUsers({ limit: 0, select: 'username,image' }),
      ]);

      const postsWithAuthors = mergePostsWithAuthors(
        postsResponse.posts || [],
        usersResponse.users || []
      );

      setPosts(postsWithAuthors);
      setTotalCount(postsResponse.total);
    } catch (error) {
      handleApiError(error, 'fetchPosts');
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (postData: Partial<Post>) => {
    try {
      const newPost = await postsApi.createPost(postData);
      setPosts(prevPosts => [newPost, ...prevPosts]);
      return newPost;
    } catch (error) {
      handleApiError(error, 'createPost');
      throw error;
    }
  };

  const updatePost = async (id: number, postData: Partial<Post>) => {
    try {
      const updatedPost = await postsApi.updatePost(id, postData);
      setPosts(prevPosts =>
        prevPosts.map(post => post.id === id ? updatedPost : post)
      );
      return updatedPost;
    } catch (error) {
      handleApiError(error, 'updatePost');
      throw error;
    }
  };

  const deletePost = async (id: number) => {
    try {
      await postsApi.deletePost(id);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    } catch (error) {
      handleApiError(error, 'deletePost');
      throw error;
    }
  };

  return {
    posts,
    totalCount,
    isLoading,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
};

// src/pages/PostsManagerPage/hooks/usePostsSearch.ts
export const usePostsSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchPosts } = usePostsManager();
  const { currentParams } = usePagination();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await fetchPosts(currentParams);
      return;
    }

    try {
      const response = await postsApi.searchPosts(searchQuery);
      // 검색 결과 처리
    } catch (error) {
      handleApiError(error, 'searchPosts');
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!text || !highlight.trim()) {
      return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i}>{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    highlightText,
  };
};

// src/pages/PostsManagerPage/hooks/usePagination.ts
export const usePagination = () => {
  const [currentSkip, setCurrentSkip] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(PAGINATION.DEFAULT_LIMIT);

  const { updateURL } = useUrlSync();

  const goToNextPage = () => {
    setCurrentSkip(prevSkip => prevSkip + currentLimit);
    updateURL();
  };

  const goToPreviousPage = () => {
    setCurrentSkip(prevSkip => Math.max(0, prevSkip - currentLimit));
    updateURL();
  };

  const changeLimit = (newLimit: number) => {
    setCurrentLimit(newLimit);
    setCurrentSkip(0); // 페이지 크기 변경 시 첫 페이지로
    updateURL();
  };

  const currentParams: PaginationParams = {
    skip: currentSkip,
    limit: currentLimit,
  };

  return {
    currentSkip,
    currentLimit,
    currentParams,
    goToNextPage,
    goToPreviousPage,
    changeLimit,
  };
};
```

#### 체크리스트

- [ ] usePostsManager 훅 생성
- [ ] useCommentsManager 훅 생성
- [ ] usePostsSearch 훅 생성
- [ ] usePagination 훅 생성
- [ ] usePostsDialog 훅 생성
- [ ] useUrlSync 훅 생성
- [ ] 기존 로직을 훅으로 이전

---

## Phase 5: 상태 관리 개선 (영향도 높음)

### 5.1 전역 상태 관리 도입 ⏱️ 8-12시간

**영향도**: 🔴 높음 | **우선순위**: 🟡 중간 | **난이도**: ⭐⭐⭐⭐

#### 작업 내용

```typescript
// src/shared/store/posts.ts
import { atom } from 'jotai';

export const postsAtom = atom<Post[]>([]);
export const postsLoadingAtom = atom<boolean>(false);
export const postsTotalCountAtom = atom<number>(0);
export const selectedPostAtom = atom<Post | null>(null);

// Derived atoms
export const postsCountAtom = atom(get => get(postsAtom).length);

// Action atoms
export const fetchPostsAtom = atom(
  null,
  async (get, set, params: PaginationParams) => {
    set(postsLoadingAtom, true);
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        postsApi.fetchPosts(params),
        usersApi.fetchUsers({ limit: 0, select: 'username,image' }),
      ]);

      const postsWithAuthors = mergePostsWithAuthors(
        postsResponse.posts || [],
        usersResponse.users || []
      );

      set(postsAtom, postsWithAuthors);
      set(postsTotalCountAtom, postsResponse.total);
    } catch (error) {
      handleApiError(error, 'fetchPosts');
    } finally {
      set(postsLoadingAtom, false);
    }
  }
);

// src/shared/store/ui.ts
export const dialogsAtom = atom({
  isAddPostDialogOpen: false,
  isEditPostDialogOpen: false,
  isPostDetailDialogOpen: false,
  isUserModalOpen: false,
  isAddCommentDialogOpen: false,
  isEditCommentDialogOpen: false,
});

export const searchAtom = atom({
  query: '',
  selectedTag: '',
  sortBy: '',
  sortOrder: 'asc' as const,
});
```

#### 체크리스트

- [ ] Jotai atoms 정의
- [ ] Posts 관련 상태를 atom으로 이전
- [ ] Comments 관련 상태를 atom으로 이전
- [ ] UI 상태를 atom으로 이전
- [ ] 컴포넌트에서 useAtom 사용
- [ ] 기존 useState 제거

---

## Phase 6: 폴더 구조 개편 (영향도 높음)

### 6.1 FSD 아키텍처 적용 ⏱️ 12-16시간

**영향도**: 🔴 높음 | **우선순위**: 🟡 중간 | **난이도**: ⭐⭐⭐⭐⭐

#### 최종 폴더 구조

```
src/
├── app/                          # 앱 설정 및 프로바이더
│   ├── providers/
│   └── App.tsx
├── pages/                        # 페이지 컴포넌트
│   └── posts-manager/
│       ├── ui/
│       └── index.ts
├── widgets/                      # 복합 UI 블록
│   ├── posts-table/
│   ├── posts-search/
│   └── posts-pagination/
├── features/                     # 사용자 시나리오
│   ├── posts-management/
│   │   ├── ui/
│   │   ├── model/
│   │   └── api/
│   ├── comments-management/
│   └── search-and-filter/
├── entities/                     # 비즈니스 엔티티
│   ├── post/
│   │   ├── model/
│   │   ├── ui/
│   │   └── api/
│   ├── comment/
│   └── user/
└── shared/                       # 공통 코드
    ├── ui/
    ├── api/
    ├── hooks/
    ├── utils/
    ├── constants/
    └── types/
```

## 성공 지표 및 검증 방법

### 정량적 지표

- [ ] 컴포넌트당 평균 줄 수: 815줄 → 50줄 이하
- [ ] 함수당 평균 줄 수: 20줄 이하
- [ ] TypeScript 에러 0개
- [ ] ESLint 에러 0개
- [ ] 테스트 통과율 100%

### 정성적 지표

- [ ] 코드 가독성 향상
- [ ] 컴포넌트 재사용성 증가
- [ ] 개발자 경험 개선
- [ ] 유지보수성 향상

### 각 Phase별 검증 체크리스트

#### Phase 1 완료 후

- [ ] 모든 매직 넘버가 상수로 정의됨
- [ ] 모든 데이터 타입이 정의됨
- [ ] TypeScript 컴파일 에러 없음

#### Phase 2 완료 후

- [ ] 모든 함수명이 Clean Code 패턴을 따름
- [ ] 20줄 이상인 함수가 없음
- [ ] 에러 처리가 표준화됨

#### Phase 3 완료 후

- [ ] API 호출이 표준화됨
- [ ] 중복 코드가 제거됨
- [ ] 각 모듈의 책임이 명확함

#### Phase 4 완료 후

- [ ] 컴포넌트가 50줄 이하로 분리됨
- [ ] 커스텀 훅으로 로직이 분리됨
- [ ] 컴포넌트 재사용성이 높아짐

#### Phase 5 완료 후

- [ ] 전역 상태가 적절히 관리됨
- [ ] Props drilling이 제거됨
- [ ] 상태 변경이 예측 가능함

#### Phase 6 완료 후

- [ ] FSD 아키텍처가 적용됨
- [ ] 모듈 간 의존성이 명확함
- [ ] 확장성이 확보됨

## 위험 요소 및 대응 방안

### 주요 위험 요소

1. **기능 회귀**: 리팩토링 중 기존 기능 손상
2. **타입 에러**: TypeScript 도입 시 예상치 못한 타입 에러
3. **상태 동기화**: 전역 상태 도입 시 상태 동기화 문제

### 대응 방안

1. **점진적 개선**: 한 번에 하나씩, 작은 단위로 진행
2. **기능 테스트**: 각 단계마다 기능 테스트 수행
3. **백업 유지**: Git을 통한 각 단계별 커밋
4. **단계별 검증**: 각 Phase 완료 후 전체 기능 검증

이 계획을 따라 단계별로 진행하면 안전하고 체계적인 리팩토링을 수행할 수 있습니다.
