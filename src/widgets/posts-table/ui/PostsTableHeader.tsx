import { Plus } from "lucide-react"

import { PostSearchParams } from "@/entities/post/model"
import { PostDialogs } from "@/features/post-dialogs/ui"
import { useDialog } from "@/shared/hook/useDialog"
import { Button } from "@/shared/ui"
import { CardHeader, CardTitle } from "@/shared/ui/card"

interface PostsTableHeaderProps {
  searchCondition: PostSearchParams
}

export const PostsTableHeader = ({ searchCondition }: PostsTableHeaderProps) => {
  // 게시물 추가 모달 열기
  const { open: openAddPostDialog, component: addPostDialog } = useDialog("post-add")
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => openAddPostDialog(<PostDialogs searchCondition={searchCondition} />)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      {addPostDialog}
    </>
  )
}
