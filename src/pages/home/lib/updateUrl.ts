import { NavigateFunction } from 'react-router-dom';

// 기본값 정의
const DEFAULT_VALUES = {
  skip: 0,
  limit: 10,
  search: '',
  sortBy: 'none',
  sortOrder: 'asc',
  tag: '',
} as const;

export function updateUrl(
  navigate: NavigateFunction,
  params: Record<string, string | number | undefined>,
) {
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // 값이 존재하고, 기본값과 다르며, 빈 문자열이 아닌 경우에만 URL에 추가
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== DEFAULT_VALUES[key as keyof typeof DEFAULT_VALUES]
    ) {
      sp.set(key, String(value));
    }
  });

  // URL 파라미터가 없으면 '?'도 제거
  const queryString = sp.toString();
  navigate(queryString ? `?${queryString}` : '');
}
