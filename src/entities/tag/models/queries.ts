import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTags } from "./api";
import { tagsKeys } from "../../../shared/query-keys/tags";
import type { Tag } from "./types";

export function useTagsQuery(enabled = true) {
  return useQuery<Tag[]>({
    queryKey: tagsKeys.all,
    queryFn: getTags,
    enabled,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useEnsureTags() {
  const qc = useQueryClient();
  return () =>
    qc.ensureQueryData<Tag[]>({
      queryKey: tagsKeys.all,
      queryFn: getTags,
    });
}
