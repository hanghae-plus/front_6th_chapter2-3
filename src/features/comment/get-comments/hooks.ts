import { useComments } from "../../../entities/comment/model/hooks"

export const useGetComments = (postId: number) => {
  const { data } = useComments(postId)

  return {
    comments: data?.comments || [],
  }
}
