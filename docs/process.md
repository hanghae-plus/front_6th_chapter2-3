# 📈 진행 상황

## ✅ Phase 1: 개발 환경 설정

### 1) eslint, prettier 설정

#### 요구사항

- @ 그룹 내에서 FSD 순서 유지
- 폴더구조상으론 레이어 계층을 이해하기 위해 1_app, 2_pages으로 폴더를 만들었지만 절대 경로 상으론 `@/app`, `@/pages`로 사용
- `@/widgets`, `@/widgets/Component` 모두 사용 가능 (index 파일 + 개별 파일 접근)
- 외부 라이브러리, 내부 라이브러리, 타입 임포트 문끼리 그룹화
- scoped package(@로 시작하는 외부 라이브러리) 별도 그룹화

#### **Import 정렬 설정**

- `@trivago/prettier-plugin-sort-imports` 플러그인 설정
- Import 순서: React → 외부 라이브러리 → scoped 외부 라이브러리 → FSD 내부 라이브러리 → 상대경로 → 타입
- 그룹 간 자동 공백 추가 (`importOrderSeparation: true`)
- scoped package 예외 처리: `^@(?!(app|pages|widgets|features|entities|shared)/)`

#### **Path Alias 설정**

- TypeScript: `tsconfig.app.json`에 index 파일 및 와일드카드 매핑
- ESLint: `import/resolver`에 index 파일 + 와일드카드 경로 설정
- Vite: `vite.config.ts`에 index 파일 + 와일드카드 alias 설정

#### **현재 Import 순서**

```typescript
// 1. React 생태계
import React from 'react';
import ReactDOM from 'react-dom';

// 2. 외부 라이브러리 (일반)
import axios from 'axios';
import lodash from 'lodash';

// 3. 외부 라이브러리 (scoped packages)
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

// 4. FSD 내부 라이브러리 (index 파일 접근)
import { App } from '@/app';
import { PostsManagerPage } from '@/pages';
import { Header, Footer } from '@/widgets';
import { LoginForm } from '@/features';
import { User } from '@/entities';
import { Button } from '@/shared';

// 5. 상대 경로
import { Component } from '../Component';
import './App.css';

// 6. 타입 Import
import type { User } from '@/entities/User';
import type { Props } from './types';
```

## ✅ Phase 2: FSD 아키텍처 적용

### 1) 디렉토리 구조 변경

#### **레이어별 디렉토리 구성**

- `src/1_app/` - 애플리케이션 레이어 (App.tsx)
- `src/2_pages/` - 페이지 레이어 (PostsManagerPage.tsx)
- `src/3_widgets/` - 위젯 레이어 (Header.tsx, Footer.tsx)
- `src/4_features/` - 기능 레이어 (준비됨)
- `src/5_entities/` - 엔티티 레이어 (준비됨)
- `src/6_shared/` - 공유 레이어 (준비됨)

#### **파일 이동 및 정리**

- `src/App.tsx` → `src/1_app/App.tsx`
- `src/pages/PostsManagerPage.tsx` → `src/2_pages/PostsManagerPage.tsx`
- `src/components/Header.tsx` → `src/3_widgets/Header.tsx`
- `src/components/Footer.tsx` → `src/3_widgets/Footer.tsx`

#### **Public API 설정**

- 모든 FSD 레이어에 index.ts 파일 생성
- 각 레이어의 public API를 통한 import/export
- 지원되는 경로 패턴:
  - `@/widgets` → `src/3_widgets/index.ts`
  - `@/widgets/*` → `src/3_widgets/*` (개별 파일 접근)

#### **설정된 절대 경로**

```typescript
// Index 파일 접근
'@/app'      → 'src/1_app/index.ts'
'@/pages'    → 'src/2_pages/index.ts'
'@/widgets'  → 'src/3_widgets/index.ts'
'@/features' → 'src/4_features/index.ts'
'@/entities' → 'src/5_entities/index.ts'
'@/shared'   → 'src/6_shared/index.ts'

// 개별 파일 접근
'@/widgets/*' → 'src/3_widgets/*'
'@/shared/*'  → 'src/6_shared/*'
'@/*'         → 'src/*' (루트 접근)
```

#### 🎯 **현재 상태**

- **Path Alias**: TypeScript, ESLint, Vite 모든 환경에서 정상 동작
- **Index 파일**: 모든 FSD 레이어에 public API 구성 완료
- **Import Order**: 6단계 그룹화 자동 정렬 적용
- **Staged**: FSD 구조 변경 및 설정 파일들 준비 완료
