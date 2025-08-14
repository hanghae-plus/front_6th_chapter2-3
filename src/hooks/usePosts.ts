import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchPosts, searchPosts, fetchPostsByTag } from "../api/posts";
import { fetchUsersSummary } from "../api/users";
import type { Post, UserSummary } from "../types";

export const usePosts = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // State
    const [posts, setPosts] = useState<Post[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Filters and Pagination
    const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"));
    const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"));
    const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
    const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "");
    const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "id");
    const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc");

    // URL Update Logic
    const updateURL = useCallback(() => {
        const params = new URLSearchParams();
        if (skip) params.set("skip", skip.toString());
        if (limit) params.set("limit", limit.toString());
        if (searchQuery) params.set("search", searchQuery);
        if (selectedTag) params.set("tag", selectedTag);
        if (sortBy) params.set("sortBy", sortBy);
        if (sortOrder) params.set("sortOrder", sortOrder);
        navigate(`?${params.toString()}`, { replace: true });
    }, [skip, limit, searchQuery, selectedTag, sortBy, sortOrder, navigate]);

    // Data Fetching Logic
    const getPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let postsData;
            if (searchQuery) {
                postsData = await searchPosts(searchQuery);
            } else if (selectedTag && selectedTag !== "all") {
                postsData = await fetchPostsByTag(selectedTag);
            } else {
                postsData = await fetchPosts(limit, skip);
            }

            const usersData = await fetchUsersSummary();
            const usersById = usersData.users.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {} as Record<number, UserSummary>);

            const postsWithUsers = postsData.posts.map(post => ({
                ...post,
                author: usersById[post.userId],
            }));

            setPosts(postsWithUsers);
            setTotal(postsData.total);
        } catch (e) {
            setError(e as Error);
            console.error("Failed to fetch posts:", e);
        } finally {
            setLoading(false);
        }
    }, [limit, skip, searchQuery, selectedTag]);

    // Effects
    useEffect(() => {
        getPosts();
        updateURL();
    }, [skip, limit, sortBy, sortOrder, selectedTag, getPosts, updateURL]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSkip(parseInt(params.get("skip") || "0"));
        setLimit(parseInt(params.get("limit") || "10"));
        setSearchQuery(params.get("search") || "");
        setSelectedTag(params.get("tag") || "");
        setSortBy(params.get("sortBy") || "id");
        setSortOrder(params.get("sortOrder") || "asc");
    }, [location.search]);

    const handleSearch = () => {
        setSkip(0); // Reset to first page on new search
        getPosts();
        updateURL();
    };

    return {
        posts,
        total,
        loading,
        error,
        skip,
        limit,
        searchQuery,
        selectedTag,
        sortBy,
        sortOrder,
        setSkip,
        setLimit,
        setSearchQuery,
        setSelectedTag,
        setSortBy,
        setSortOrder,
        handleSearch,
    };
};
