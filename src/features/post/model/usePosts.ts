import { useAtom, useSetAtom } from "jotai"
import { useEffect, useCallback, useRef } from "react"
import { postsAtom, totalPostsAtom, loadingAtom, skipAtom, limitAtom, selectedTagAtom } from "../../../store/postsAtoms"
import { postsApi } from "../../../entities/post/api/postsApi"
import { NewPost, Post } from "../../../types"

export const usePosts = () => {
  const [posts] = useAtom(postsAtom)
  const [total] = useAtom(totalPostsAtom)
  const [loading] = useAtom(loadingAtom)
  const [skip] = useAtom(skipAtom)
  const [limit] = useAtom(limitAtom)
  const [selectedTag] = useAtom(selectedTagAtom)

  // setter 함수들을 useSetAtom으로 안정화
  const setPostsStable = useSetAtom(postsAtom)
  const setTotalStable = useSetAtom(totalPostsAtom)
  const setLoadingStable = useSetAtom(loadingAtom)

  // 이전 값들을 저장하여 불필요한 API 호출 방지
  const prevSkipRef = useRef(skip)
  const prevLimitRef = useRef(limit)
  const prevSelectedTagRef = useRef(selectedTag)

  const fetchPosts = useCallback(async () => {
    setLoadingStable(true)
    try {
      const result = await postsApi.getPostsWithUsers(limit, skip)
      setPostsStable(result.posts)
      setTotalStable(result.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoadingStable(false)
    }
  }, [limit, skip, setPostsStable, setTotalStable, setLoadingStable])

  const fetchPostsByTag = useCallback(
    async (tag: string) => {
      setLoadingStable(true)
      try {
        const result = await postsApi.getPostsByTag(tag, limit, skip)
        setPostsStable(result.posts)
        setTotalStable(result.total)
      } catch (error) {
        console.error("태그별 게시물 가져오기 오류:", error)
      } finally {
        setLoadingStable(false)
      }
    },
    [limit, skip, setPostsStable, setTotalStable, setLoadingStable],
  )

  const addPost = useCallback(
    async (newPost: NewPost) => {
      try {
        const data = await postsApi.addPost(newPost)
        setPostsStable((prev) => [data, ...prev])
        return data
      } catch (error) {
        console.error("게시물 추가 오류:", error)
        throw error
      }
    },
    [setPostsStable],
  )

  const updatePost = useCallback(
    async (post: Post) => {
      try {
        const data = await postsApi.updatePost(post.id, post)
        setPostsStable((prev) => prev.map((p) => (p.id === data.id ? data : p)))
        return data
      } catch (error) {
        console.error("게시물 업데이트 오류:", error)
        throw error
      }
    },
    [setPostsStable],
  )

  const deletePost = useCallback(
    async (id: number) => {
      try {
        await postsApi.deletePost(id)
        setPostsStable((prev) => prev.filter((post) => post.id !== id))
      } catch (error) {
        console.error("게시물 삭제 오류:", error)
        throw error
      }
    },
    [setPostsStable],
  )

  useEffect(() => {
    // 값이 실제로 변경되었을 때만 API 호출
    const skipChanged = prevSkipRef.current !== skip
    const limitChanged = prevLimitRef.current !== limit
    const tagChanged = prevSelectedTagRef.current !== selectedTag

    if (skipChanged || limitChanged || tagChanged) {
      if (selectedTag && selectedTag !== "all") {
        fetchPostsByTag(selectedTag)
      } else {
        fetchPosts()
      }

      // 현재 값들을 이전 값으로 저장
      prevSkipRef.current = skip
      prevLimitRef.current = limit
      prevSelectedTagRef.current = selectedTag
    }
  }, [skip, limit, selectedTag, fetchPosts, fetchPostsByTag])

  return {
    posts,
    total,
    loading,
    fetchPosts,
    fetchPostsByTag,
    addPost,
    updatePost,
    deletePost,
  }
}
