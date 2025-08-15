export const sortByOptions = [
  { value: "none", label: "없음" },
  { value: "id", label: "ID" },
  { value: "title", label: "제목" },
  { value: "reactions", label: "반응" },
]

// 태그 옵션 설정
export const tagOptions = [
  { value: "all", label: "모든 태그" },
  // 실제 태그 데이터는 동적으로 생성됨
]

// 태그 옵션을 동적으로 생성하는 함수
export const createTagOptions = (tags: Array<{ slug: string }>) => [
  { value: "all", label: "모든 태그" },
  ...tags.map((tag) => ({ value: tag.slug, label: tag.slug })),
]

export const sortOrderOptions = [
  { value: "asc", label: "오름차순" },
  { value: "desc", label: "내림차순" },
]
