# Shared Layer (별칭: Base)

앱의 기본 구성 요소를 모아두는 레이어입니다.

> **폴더명**: `base` (FSD Shared Layer의 커스텀 별칭)

## 역할

- 재사용 가능한 공통 모듈
- 서드파티 라이브러리 연동
- 비즈니스 로직이 없는 순수 기능

## 구조

Slice 없이 Segment로만 구성됩니다.

```
base/           # (원래 shared/)
├── api/        # API 클라이언트, 공통 요청
├── ui/         # 공통 UI 컴포넌트
├── lib/        # 유틸리티 라이브러리
└── types/      # 공통 타입 정의
```

## 주요 Segment

- **api**: HTTP 클라이언트, 공통 API 함수
- **ui**: 디자인 시스템, 기본 컴포넌트
- **lib**: 날짜, 텍스트, 스타일 등 주제별 유틸리티
- **config**: 환경 변수, Feature Flag, 상수

## 규칙

- 비즈니스 로직 포함 금지
- Base 내부 모듈 간 자유로운 import 허용
- 각 lib는 단일 책임 원칙 준수
- Import 경로: `@/base/*`
