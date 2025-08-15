import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
  Input,
  Button,
} from '@/shared/ui'

interface UpdatePostDialogProps {
  showEditDialog: boolean
  onOpenChange: (show: boolean) => void
  selectedPost: any
  setSelectedPost: (post: any) => void
  updatePost: () => void
}

export const UpdatePostDialog = ({
  showEditDialog,
  onOpenChange,
  selectedPost,
  setSelectedPost,
  updatePost,
}: UpdatePostDialogProps) => {
  return (
    <Dialog open={showEditDialog} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='제목'
            value={selectedPost?.title || ''}
            onChange={(e) =>
              setSelectedPost({ ...selectedPost, title: e.target.value })
            }
          />
          <Textarea
            rows={15}
            placeholder='내용'
            value={selectedPost?.body || ''}
            onChange={(e) =>
              setSelectedPost({ ...selectedPost, body: e.target.value })
            }
          />
          <Button onClick={updatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
