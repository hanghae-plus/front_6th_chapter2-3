/**
 * Tag 관련 타입 정의
 */

export interface Tag {
  slug: string;
  name: string;
  url: string;
}

export interface TagsState {
  tags: Tag[];
  selectedTag: string;
  loading: boolean;
  error: string | null;
  setTags: (tags: Tag[]) => void;
  setSelectedTag: (tag: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchTags: () => Promise<void>;
}
