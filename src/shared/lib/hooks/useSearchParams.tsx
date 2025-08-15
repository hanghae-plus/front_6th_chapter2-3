import { useSearchParams as useReactRouterSearchParams } from 'react-router-dom';

export const useSearchParams = <T,>(
  name: string,
  defaultValue: string = '',
  parser: (value: string) => T = (value) => value as unknown as T,
): [T, (value: T) => void] => {
  const [searchParams, setSearchParams] = useReactRouterSearchParams();
  const value = parser(searchParams.get(name) || defaultValue);

  const setValue = (value: T) => {
    setSearchParams((searchParams) => {
      searchParams.set(name, String(value));
      return searchParams;
    });
  };

  return [value, setValue];
};
