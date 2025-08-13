import { useEffect, useState } from "react"

import { postApi } from "@/entities/post/api"
import type { PostTag } from "@/entities/post/model"

export const usePostTags = () => {
  const [tags, setTags] = useState<PostTag[]>([])

  const fetchTags = async () => {
    try {
      const data = await postApi.getTags()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return { tags }
}
