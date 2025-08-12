import { api } from "../../shared/api/client";
import type { Tag } from "./types";

export const getTags = async (): Promise<Tag[]> => {
  return api<Tag[]>(`/api/posts/tags`);
};
