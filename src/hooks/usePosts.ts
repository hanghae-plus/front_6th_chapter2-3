import React, { useState, useEffect, useCallback } from "react"
import { useSetAtom } from "jotai"
import { listSortByAtom, listSortOrderAtom, listSkipAtom, listLimitAtom, listTotalAtom } from "../shared/lib/viewAtoms"
import { useLocation, useNavigate } from "react-router-dom"
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query"
import { postsKey } from "../shared/api/queryKeys"
import { fetchPosts, searchPosts, fetchPostsByTag } from "../entities/post/api"
import type { PostsApiResponse, Post } from "../entities/post/model"
import { fetchUsersSummary } from "../entities/user/api"
import type { UserSummary } from "../entities/user/model"

const fetchPostsWithAuthors = async (
  ctx: QueryFunctionContext<ReturnType<typeof postsKey.list>>,
): Promise<PostsApiResponse & { posts: (Post & { author?: UserSummary; clientId?: string })[] }> => {
  const [, { limit, skip, searchQuery, selectedTag }] = ctx.queryKey

  let postsData
  if (searchQuery) {
    postsData = await searchPosts(searchQuery)
  } else if (selectedTag && selectedTag !== "all") {
    postsData = await fetchPostsByTag(selectedTag)
  } else {
    postsData = await fetchPosts(limit, skip)
  }

  const usersData = await fetchUsersSummary()
  const usersById = usersData.users.reduce(
    (acc, user) => {
      acc[user.id] = user
      return acc
    },
    {} as Record<number, UserSummary>,
  )

  const postsWithUsers = postsData.posts.map((post) => ({
    ...post,
    author: usersById[post.userId],
  }))

  return { ...postsData, posts: postsWithUsers }
}

export const usePosts = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "id")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "desc")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)

  // sync view atoms for cross-feature needs
  const setViewSortBy = useSetAtom(listSortByAtom)
  const setViewSortOrder = useSetAtom(listSortOrderAtom)
  const setViewSkip = useSetAtom(listSkipAtom)
  const setViewLimit = useSetAtom(listLimitAtom)
  const setViewTotal = useSetAtom(listTotalAtom)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500) // 500ms delay

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery])

  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (selectedTag) params.set("tag", selectedTag)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    navigate(`?${params.toString()}`, { replace: true })
  }, [skip, limit, searchQuery, selectedTag, sortBy, sortOrder, navigate])

  useEffect(() => {
    updateURL()
  }, [skip, limit, selectedTag, sortBy, sortOrder, debouncedSearchQuery, updateURL])

  // 정렬 변경 시 첫 페이지로 이동
  useEffect(() => {
    setSkip(0)
  }, [sortBy, sortOrder])

  const {
    data,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery<
    PostsApiResponse & { posts: (Post & { author?: UserSummary; clientId?: string })[] },
    Error,
    PostsApiResponse & { posts: (Post & { author?: UserSummary; clientId?: string })[] },
    ReturnType<typeof postsKey.list>
  >({
    queryKey: postsKey.list({
      limit,
      skip,
      searchQuery: debouncedSearchQuery,
      selectedTag,
      sortBy,
      sortOrder,
    }),
    queryFn: fetchPostsWithAuthors,
    placeholderData: (previousData) =>
      previousData as PostsApiResponse & { posts: (Post & { author?: UserSummary; clientId?: string })[] },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  const handleSearch = () => {
    setSkip(0)
    // The useQuery will automatically refetch due to debouncedSearchQuery change
  }

  // keep atoms in sync for other features (e.g., post-create)
  useEffect(() => {
    setViewSortBy(sortBy)
    setViewSortOrder(sortOrder)
    setViewSkip(skip)
    setViewLimit(limit)
    setViewTotal(data?.total || 0)
  }, [
    sortBy,
    sortOrder,
    skip,
    limit,
    data?.total,
    setViewSortBy,
    setViewSortOrder,
    setViewSkip,
    setViewLimit,
    setViewTotal,
  ])

  // 정렬된 게시물 목록
  const sortedPosts = React.useMemo(() => {
    const posts = data?.posts || []
    if (!posts.length) return posts

    return [...posts].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "reactions":
          aValue = (a.reactions?.likes || 0) + (a.reactions?.dislikes || 0)
          bValue = (b.reactions?.likes || 0) + (b.reactions?.dislikes || 0)
          break
        default: // "id"
          aValue = a.id
          bValue = b.id
      }

      // 동일 서버 id가 충돌할 수 있으므로 clientId로 안정 정렬 타이브레이커 추가
      const cmp =
        sortOrder === "desc"
          ? aValue > bValue
            ? -1
            : aValue < bValue
              ? 1
              : 0
          : aValue < bValue
            ? -1
            : aValue > bValue
              ? 1
              : 0
      if (cmp !== 0) return cmp
      const aKey = a.clientId ?? `${a.id}`
      const bKey = b.clientId ?? `${b.id}`
      return aKey.localeCompare(bKey)
    })
  }, [data?.posts, sortBy, sortOrder])

  return {
    posts: sortedPosts,
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
  }
}
