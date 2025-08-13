import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSearchParams = <T,>(
  name: string,
  defaultValue: string = '',
  parser: (value: string) => T = (value) => value as unknown as T,
): [T, Dispatch<SetStateAction<T>>] => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);

  const [value, setValue] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return parser(queryParams.get(name) || defaultValue);
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set(name, String(value));
    navigate(`?${params.toString()}`);
  }, [name, navigate, value]);

  return [value, setValue];
};
