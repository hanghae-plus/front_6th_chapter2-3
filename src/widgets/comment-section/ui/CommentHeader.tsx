import { Plus } from "lucide-react"
import { Button } from "@/shared/ui"

interface CommentHeaderProps {
  onAddComment: () => void
}

export const CommentHeader = ({ onAddComment }: CommentHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">댓글</h3>
      <Button size="sm" onClick={onAddComment}>
        <Plus className="w-3 h-3 mr-1" />
        댓글 추가
      </Button>
    </div>
  )
}
