import { useQuery2 } from "../../../shared/createQuery.ts"
import { Tag } from "../Tag.ts"

export const useQueryTags = () => useQuery2<Tag[]>(["/api/posts/tags"], { placeholderData: [] })
