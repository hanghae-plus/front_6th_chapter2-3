import { CardHeader, CardTitle } from "../../../../shared/ui"
import { Button } from "../../../../shared/ui"
import { Plus } from "lucide-react"

interface PostManagerHeaderProps {
  openAddPostModal: () => void
}

export default function PostManagerHeader({ openAddPostModal }: PostManagerHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>게시물 관리자</span>
        <Button onClick={openAddPostModal}>
          <Plus className="w-4 h-4 mr-2" />
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  )
}
