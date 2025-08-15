import { useLocation, useNavigate } from 'react-router-dom';

export const useUrlParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getParam = (key: string): string | null => {
    return new URLSearchParams(location.search).get(key);
  };

  const setParams = (params: Record<string, string | number | null | undefined>) => {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        urlParams.set(key, value.toString());
      }
    });

    navigate(`?${urlParams.toString()}`);
  };

  return {
    getParam,
    setParams,
    searchParams: new URLSearchParams(location.search),
  };
};
