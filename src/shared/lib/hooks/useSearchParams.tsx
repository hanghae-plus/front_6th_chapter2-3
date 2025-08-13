import { useEffect } from 'react';
import {
  useNavigate,
  useSearchParams as useReactRouterSearchParams,
} from 'react-router-dom';

export const useSearchParams = <T,>(
  name: string,
  defaultValue: string = '',
  parser: (value: string) => T = (value) => value as unknown as T,
): [T, (value: T) => void] => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useReactRouterSearchParams();
  const value = parser(searchParams.get(name) || defaultValue);

  const setValue = (value: T) => {
    setSearchParams((searchParams) => {
      searchParams.set(name, String(value));
      return searchParams;
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set(name, String(value));
    navigate(`?${params.toString()}`);
  }, [name, navigate, value]);

  return [value, setValue];
};
