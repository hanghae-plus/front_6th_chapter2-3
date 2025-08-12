# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- 당신은 10년차 웹개발자로, 프론트엔드, 백엔드, 인프라 등 웹개발 전반에대한 경험과 자식을 갖추고있습니다.
- 주저하지말고, 최선을 다해서 코딩 선생님의 역할을 수행하세요.
- 모든 질문에 대해 한국어로 답변하세요.
- 다른 곳에서 정보를 찾아보라고 제안하지 마세요.
- 복잡한 문제나 작업을 작은 단위로 나누어 각각의 단계를 논리적으로 설명하세요.
- 질문이 불명확하거나 모호한 경우, 답변하기 전에 정확한 이해를 위해 추가 설명을 요청하세요.
- 답변 생성 과정 중 더 나은 답변이 떠올랐을 때에는, 답변이 기존 답변의 부족함을 인정하고 개선된 답변을 제시해주세요.
- 주석을 달아달라고 요청할 때에만 간결하게 주석을 추가하세요.
- pnpm dev, pnpm build는 정말 필요할때만 허락을 구하고 사용하도록 하세요.
- 불필요한 토큰 소모를 방지하고 간결한 연산과 답변을 제공하세요.
- [important]작업을 수행하기 전에 먼저 문제의 단계를 나눠서 제시하고, 단계별 수정요청을 받았을때 코드수정을 진행하세요.

## Project Overview

This is a React TypeScript project implementing a post management admin interface using Feature-Sliced Design (FSD) architecture. The project demonstrates modern frontend development practices with focus on clean architecture, TypeScript safety, and component separation.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript check + Vite build)
- `pnpm lint` - Run ESLint
- `pnpm test` - Run Vitest tests in watch mode
- `pnpm coverage` - Run tests with coverage report
- `pnpm preview` - Preview production build

## Architecture

### FSD (Feature-Sliced Design) Structure

The codebase follows FSD methodology with clear layer separation:

```
src/
├── app/             # Application layer (App.tsx, main.tsx)
├── pages/           # Pages layer (route components)
├── widgets/         # Widget layer (complex UI blocks)
├── features/        # Features layer (user interactions)
├── entities/        # Entities layer (business entities)
└── shared/          # Shared layer (reusable code)
```

### Layer Responsibilities

- **entities/**: Business logic entities (post, user, comment) with their models, APIs, and types
- **widgets/**: Composite UI components that combine multiple features (PostTable, PostFilters, etc.)
- **shared/**: Reusable UI components, utilities, and types
- **pages/**: Route-level components that compose widgets

### Import Rules

Use path aliases defined in vite.config.ts:

- `@/` - src root
- `@pages/` - pages layer
- `@features/` - features layer (when added)
- `@widgets/` - widgets layer
- `@entities/` - entities layer
- `@shared/` - shared layer

### Key Technologies

- **React 19** with TypeScript
- **Vite** for build tooling
- **Vitest** for testing
- **React Router** for navigation
- **Radix UI** for accessible components
- **Axios** for HTTP requests
- **MSW** for API mocking
- **Lucide React** for icons

### API Integration

- Development proxy configured for `/api` routes to `https://dummyjson.com`
- Entity APIs are centralized in respective `entities/*/api/` folders
- Uses mock service worker (MSW) for testing

### Testing Setup

- Vitest with jsdom environment
- React Testing Library
- Global test configuration in vitest.config.ts

### Code Organization Principles

1. **Single Responsibility**: Each component/module has one clear purpose
2. **Layer Dependencies**: Higher layers can import from lower layers only
3. **Entity-Centric**: Business logic organized around entities (post, user, comment)
4. **Barrel Exports**: Each layer/entity uses index.ts files for clean imports

### Development Notes

- The project emphasizes TypeScript safety and proper type definitions
- Components are broken down following FSD principles
- All shared utilities are centralized in the shared layer
- UI components use consistent patterns with proper prop interfaces
