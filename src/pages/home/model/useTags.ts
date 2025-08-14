import { useEffect, useState } from 'react';
import { tagApi } from '@/entities/tag';

export function useTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagApi.getTags();
      const slugs = Array.isArray(data) ? data.map((t) => t.slug) : [];
      setTags(slugs);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTags();
  }, []);

  return { tags, loading, error, refetch: fetchTags } as const;
}
