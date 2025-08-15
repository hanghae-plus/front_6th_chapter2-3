import { FilterSelect } from "../../../shared/ui/FilterSelect"
import { createTagOptions } from "../data"
import { useSelectTag } from "../model/useSelectTag"

export const SelectTag = () => {
  const { selectedTag, tags, handleTagChange } = useSelectTag()

  // 태그 옵션 설정
  const tagOptions = createTagOptions(tags)

  return (
    <FilterSelect value={selectedTag} onValueChange={handleTagChange} placeholder="태그 선택" options={tagOptions} />
  )
}
