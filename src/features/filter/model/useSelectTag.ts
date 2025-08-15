import { useAtom } from "jotai"
import { selectedTagAtom, skipAtom } from "../../../store/postsAtoms"
import { useTags } from "../../../entities/post/api"

/**
 * 태그 선택을 관리하는 hook
 * TanStack Query를 사용해서 태그 목록을 캐싱하고 관리합니다.
 */
export const useSelectTag = () => {
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)
  const [, setSkip] = useAtom(skipAtom)

  // TanStack Query 훅 사용
  const tagsQuery = useTags()

  const tags = tagsQuery.data || []
  const isLoading = tagsQuery.isLoading
  const error = tagsQuery.error

  /**
   * 태그를 변경하는 함수
   * @param tag - 새로운 태그 값
   */
  const handleTagChange = (tag: string) => {
    console.log("태그 변경:", { from: selectedTag, to: tag })
    setSelectedTag(tag)
    // 태그가 변경되면 첫 페이지로 이동
    setSkip(0)
  }

  return {
    selectedTag,
    tags,
    isLoading,
    error,
    handleTagChange,
  }
}
