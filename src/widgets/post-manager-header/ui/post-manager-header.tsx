import React from "react"
import { Plus } from "lucide-react"
import { Button, CardHeader, CardTitle } from "@shared/ui"
import { usePostDialogStore } from "@/features/post-dialog"

export const PostManagerHeader: React.FC = () => {
  const openAddDialog = usePostDialogStore((s) => s.openAddPost)

  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>게시물 관리자</span>
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  )
}
