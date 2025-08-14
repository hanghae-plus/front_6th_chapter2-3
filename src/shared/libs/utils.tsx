import { SearchParamsType } from "../model"

export const highlightText = (text: string, highlight: string) => {
  if (!text) return null
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  const regex = new RegExp(`(${highlight})`, "gi")
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </span>
  )
}

// TODO: 추후 개선의 여지가 있어보임 -> SearchParamsType에 타입이 추가된다면? 분기도 추가해야하고.. 인터페이스도 수정해야함
export const updateURLSearchParams = (params: SearchParamsType) => {
  const { skip, limit, searchQuery, sortBy, sortOrder, selectedTag } = params
  const urlParams = new URLSearchParams()

  if (skip) urlParams.set("skip", skip.toString())
  if (limit) urlParams.set("limit", limit.toString())
  if (searchQuery) urlParams.set("search", searchQuery)
  if (sortBy) urlParams.set("sortBy", sortBy)
  if (sortOrder) urlParams.set("sortOrder", sortOrder)
  if (selectedTag) urlParams.set("tag", selectedTag)

  return urlParams.toString()
}