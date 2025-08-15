import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui'
import { highlightText } from '@/shared/utils/highlightText'

interface DetailPostDialogProps {
  showPostDetailDialog: boolean
  onOpenChange: (show: boolean) => void
  selectedPost: any
  searchQuery: string
  children?: React.ReactNode
}

export const DetailPostDialog = ({
  showPostDetailDialog,
  onOpenChange,
  selectedPost,
  searchQuery,
  children,
}: DetailPostDialogProps) => {
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>
            {highlightText(selectedPost?.title, searchQuery)}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(selectedPost?.body, searchQuery)}</p>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
