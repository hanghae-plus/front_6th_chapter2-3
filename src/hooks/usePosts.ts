import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, searchPosts, fetchPostsByTag } from "../api/posts";
import { fetchUsersSummary } from "../api/users";
import type { Post, UserSummary } from "../types";

const fetchPostsWithAuthors = async ({ queryKey }: { queryKey: any }) => {
  const [_key, { limit, skip, searchQuery, selectedTag }] = queryKey;

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

  const postsWithUsers = postsData.posts.map((post) => ({
    ...post,
    author: usersById[post.userId],
  }));

  return { ...postsData, posts: postsWithUsers };
};

export const usePosts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"));
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"));
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "");
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "id");
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

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

  useEffect(() => {
    updateURL();
  }, [skip, limit, selectedTag, sortBy, sortOrder, debouncedSearchQuery, updateURL]);

  const {
    data,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["posts", { limit, skip, searchQuery: debouncedSearchQuery, selectedTag }],
    queryFn: fetchPostsWithAuthors,
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = () => {
    setSkip(0);
    // The useQuery will automatically refetch due to debouncedSearchQuery change
  };

  return {
    posts: data?.posts || [],
    total: data?.total || 0,
    postsLoading,
    postsError,
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
