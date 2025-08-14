import { useState } from "react";
import { getTags } from "./api";
import { Tag } from "./types";

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);

  const fetchTags = async () => {
    const tags = await getTags();
    setTags(tags);
  };

  return { tags, setTags, fetchTags };
};
