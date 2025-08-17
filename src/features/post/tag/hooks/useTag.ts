import { getTagApi, getPostsByTagApi } from "../api/tag-api"
import { loadingAtom } from "../../../../shared/model/store"
import { tagsAtom, selectedTagAtom } from "../model/store"
import { useAtom } from "jotai"
import { limitAtom, postsAtom, skipAtom, totalPostsAtom } from "../../../../entities/post/model/store"
import { PostTag } from "../model/types"
import { getUserApi } from "../../../../entities/user/api/user-api"

export const usePost = () => {
  const [loading, setLoading] = useAtom(loadingAtom)
  const [posts, setPosts] = useAtom(postsAtom)
  const [total, setTotal] = useAtom(totalPostsAtom)
  const [tags, setTags] = useAtom(tagsAtom)
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)
  const [skip, setSkip] = useAtom(skipAtom)
  const [limit, setLimit] = useAtom(limitAtom)

  // 태그 목록 가져오기
  const fetchTags = async () => {
    try {
      const response = await getTagApi()
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: PostTag) => {
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([getPostsByTagApi(tag, limit, skip), getUserApi()])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()
      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  return {
    tags,
    selectedTag,
    setSelectedTag,
    fetchPostsByTag,
    fetchTags,
  }
}
