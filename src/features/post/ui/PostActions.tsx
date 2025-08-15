// features/post/ui/PostActions.tsx
import { Button } from '@/shared/ui'
import { MessageSquare, Edit2, Trash2 } from 'lucide-react'

interface PostActionsProps {
  post: any
  onView: (post: any) => void
  onEdit: (post: any) => void
  onDelete: (id: number | string) => void
}

export const PostActions = ({
  post,
  onView,
  onEdit,
  onDelete,
}: PostActionsProps) => (
  <div className='flex items-center gap-2'>
    <Button variant='ghost' size='sm' onClick={() => onView(post)}>
      <MessageSquare className='w-4 h-4' />
    </Button>
    <Button variant='ghost' size='sm' onClick={() => onEdit(post)}>
      <Edit2 className='w-4 h-4' />
    </Button>
    <Button variant='ghost' size='sm' onClick={() => onDelete(post.id)}>
      <Trash2 className='w-4 h-4' />
    </Button>
  </div>
)
