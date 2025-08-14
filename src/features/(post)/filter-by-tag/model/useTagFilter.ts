import { useCallback, useState } from 'react';

export function useTagFilter(initialTag: string = '') {
  const [selectedTag, setSelectedTag] = useState<string>(initialTag);

  const setTag = useCallback((tag: string) => {
    setSelectedTag(tag);
  }, []);

  return { selectedTag, setTag } as const;
}
