import { useState, useEffect } from "react";
import { fetchTags as apiFetchTags } from "../api/tags";
import type { Tag } from "../types";

export const useTags = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const getTags = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedTags = await apiFetchTags();
                setTags(fetchedTags);
            } catch (e) {
                setError(e as Error);
                console.error("Failed to fetch tags:", e);
            } finally {
                setLoading(false);
            }
        };

        getTags();
    }, []);

    return { tags, loading, error };
};
