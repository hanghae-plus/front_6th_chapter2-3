import { CardHeader, CardTitle, Button } from '@/shared/ui/'
import { Plus } from 'lucide-react'

interface PostHeaderProps {
  onShowAddDialog: (show: boolean) => void
}

export const PostHeader = ({ onShowAddDialog }: PostHeaderProps) => (
  <CardHeader>
    <CardTitle className='flex items-center justify-between'>
      <span>게시물 관리자</span>
      <Button onClick={() => onShowAddDialog(true)}>
        <Plus className='w-4 h-4 mr-2' />
        게시물 추가
      </Button>
    </CardTitle>
  </CardHeader>
)
