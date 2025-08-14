import { ModeType } from "../fetch-posts-by-mode/fetchMode.store"

export const queryBuilderHelper = (mode: ModeType, obj: Record<string, string | number>) => {
  const { limit, skip, sortBy, order, tag, q } = obj

  let query = "/posts"

  switch (mode) {
    case "list":
      query += `?limit=${limit}&skip=${skip}`
      if (sortBy) query += `&sortBy=${sortBy}`
      if (order) query += `&order=${order}`
      break
    case "search":
      query += `/search?q=${q}&limit=${limit}&skip=${skip}`
      if (sortBy) query += `&sortBy=${sortBy}`
      if (order) query += `&order=${order}`
      break
    case "tag":
      query += `/tag/${tag}?limit=${limit}&skip=${skip}`
      if (sortBy) query += `&sortBy=${sortBy}`
      if (order) query += `&order=${order}`
      break
    default:
      query += `?limit=${limit}&skip=${skip}`
      if (sortBy) query += `&sortBy=${sortBy}`
      if (order) query += `&order=${order}`
      break
  }
  return query
}
