import { useTagsQuery } from "./queries";

export function useTags() {
  const { data, isLoading, isError } = useTagsQuery();

  return {
    tags: data ?? [],
    isLoading,
    isError,
  } as const;
}
