import { useEffect } from 'react';

import { useErrorStore } from '../../stores/errorStore';

export const ErrorToast = () => {
  const { error, setError } = useErrorStore();

  useEffect(() => {
    if (!error) return;

    alert(`에러 발생: ${error.message}`);

    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error, setError]);

  return null;
};
