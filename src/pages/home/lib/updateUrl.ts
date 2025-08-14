import { NavigateFunction } from 'react-router-dom';

export function updateUrl(
  navigate: NavigateFunction,
  params: Record<string, string | number | undefined>,
) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) sp.set(key, String(value));
  });
  navigate(`?${sp.toString()}`);
}
