// entities/tag/models/index.ts (혹은 기존 useTags 파일)
import { useCallback, useEffect, useState } from "react";
import type { Tag } from "./types";
import { useEnsureTags } from "./queries";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const ensureTags = useEnsureTags();

  const fetchTags = useCallback(async () => {
    const data = await ensureTags();
    setTags(data ?? []);
  }, [ensureTags]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, fetchTags } as const;
}
