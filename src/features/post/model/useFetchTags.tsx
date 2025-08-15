import { fetchTagsApi } from '@/entities/post/api/fetchTags'

export const useFetchTags = (
  setTags: React.Dispatch<React.SetStateAction<string[]>>
) => {
  return async () => {
    try {
      const data = await fetchTagsApi()
      setTags(data)
    } catch (error) {
      console.error('태그 가져오기 오류:', error)
    }
  }
}
