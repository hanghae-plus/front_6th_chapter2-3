import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useBasicUsers } from '@features/user/get-user'
import { usePostsBasic, usePostsBySearch, usePostsByTag } from '@features/post/get-post'
import { useDeletePostMutation } from '@features/post/delete-post'
import { IPost } from '@entities/post'
import { IUser } from '@shared/model'

export const usePostsTableData = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // URL에서 상태 읽기
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'))
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'))
  const searchQuery = queryParams.get('search') || ''
  const selectedTag = queryParams.get('tag') || ''

  // 사용자 목록 쿼리 (독립적 캐싱)
  const { data: usersData } = useBasicUsers()

  // 기본 게시물 목록 쿼리
  const { data: basicPostsData, isLoading: isBasicLoading } = usePostsBasic({
    limit,
    skip,
    enabled: !searchQuery && (!selectedTag || selectedTag === 'all'),
  })

  // 검색 게시물 쿼리
  const { data: searchPostsData, isLoading: isSearchLoading } = usePostsBySearch({
    query: searchQuery,
    enabled: !!searchQuery,
  })

  // 태그별 게시물 쿼리
  const { data: tagPostsData, isLoading: isTagLoading } = usePostsByTag({
    tag: selectedTag,
    enabled: !!selectedTag && selectedTag !== 'all' && !searchQuery,
  })

  // 게시물 삭제 뮤테이션
  const deletePostMutation = useDeletePostMutation()

  // 현재 활성화된 데이터 선택
  const rawPostsData = searchQuery
    ? searchPostsData
    : selectedTag && selectedTag !== 'all'
      ? tagPostsData
      : basicPostsData

  const isLoading = isBasicLoading || isSearchLoading || isTagLoading

  // 최종 데이터 조합 (useMemo로 최적화)
  const postsData = useMemo(() => {
    if (!rawPostsData || !usersData) return null

    const withAuthors: IPost[] = rawPostsData.posts.map((post: IPost) => ({
      ...post,
      author: usersData.users.find((u: IUser) => u.id === post.userId),
    }))

    return { posts: withAuthors, total: rawPostsData.total }
  }, [rawPostsData, usersData])

  // 현재 게시물 목록과 총 개수
  const posts = postsData?.posts || []
  const total = postsData?.total || 0

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams(location.search)
    if (skip) params.set('skip', skip.toString())
    if (limit) params.set('limit', limit.toString())
    navigate(`?${params.toString()}`)
  }

  // 태그 클릭 핸들러
  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(location.search)
    params.set('tag', tag)
    navigate(`?${params.toString()}`)
  }

  return {
    posts,
    total,
    isLoading,
    searchQuery,
    selectedTag,
    skip,
    setSkip,
    limit,
    setLimit,
    updateURL,
    handleTagClick,
    deletePostMutation,
  }
}