import { CommentSection } from "@/widgets/comment-section"
import { usePostDetail, useSelectedPostStore } from "@/features/post/read-post/model"
import { useDialogActions, useDialogStore } from "@/shared/model"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"

export const PostDetailDialog = () => {
  const { selectedPostId: postId } = useSelectedPostStore()
  const isOpen = useDialogStore((state) => state.dialogs.POST_DETAIL)
  const { hideDialog } = useDialogActions()

  // postId가 유효할 때만 쿼리 실행
  const { data, isLoading, error } = usePostDetail(postId!)

  // postId가 없거나 다이얼로그가 닫혀있으면 렌더링하지 않음
  if (!postId || !isOpen) return null

  // 로딩 중일 때
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={() => hideDialog("POST_DETAIL")}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>로딩 중</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-8">로딩 중...</div>
        </DialogContent>
      </Dialog>
    )
  }

  // 에러가 있거나 데이터가 없을 때
  if (error || !data) {
    return (
      <Dialog open={isOpen} onOpenChange={() => hideDialog("POST_DETAIL")}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>오류</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-8 text-red-500">데이터를 불러오는데 실패했습니다.</div>
        </DialogContent>
      </Dialog>
    )
  }

  const { post } = data

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => hideDialog("POST_DETAIL")}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{post.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{post.body}</p>
            <CommentSection postId={postId} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
