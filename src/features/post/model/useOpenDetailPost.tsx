import { useAtom } from "jotai"
import { openPostDetailAtom } from "./PostDetailContext"
import { Post } from "../../../types"

export const useOpenDetailPost = () => {
  const [, openPostDetail] = useAtom(openPostDetailAtom)

  const handleOpenPostDetail = (post: Post) => {
    openPostDetail({ post })
  }

  return {
    openPostDetail: handleOpenPostDetail,
  }
}
