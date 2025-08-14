import type { Tag } from "../types";

const API_BASE_URL = "/api";

export const fetchTags = async (): Promise<Tag[]> => {
    const response = await fetch(`${API_BASE_URL}/posts/tags`);
    if (!response.ok) throw new Error("Failed to fetch tags");
    return response.json();
};
