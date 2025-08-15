import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
  Button,
} from '@/shared/ui'

interface AddPostDialogProps {
  showAddDialog: boolean
  onOpenChange: (show: boolean) => void
  newPost: { title: string; body: string; userId: number }
  setNewPost: (post: { title: string; body: string; userId: number }) => void
  addPost: () => void
}

export const AddPostDialog = ({
  showAddDialog,
  onOpenChange,
  newPost,
  setNewPost,
  addPost,
}: AddPostDialogProps) => (
  <Dialog open={showAddDialog} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>새 게시물 추가</DialogTitle>
      </DialogHeader>
      <div className='space-y-4'>
        <Input
          placeholder='제목'
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <Textarea
          rows={30}
          placeholder='내용'
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
        />
        <Input
          type='number'
          placeholder='사용자 ID'
          value={newPost.userId}
          onChange={(e) =>
            setNewPost({ ...newPost, userId: Number(e.target.value) })
          }
        />
        <Button onClick={addPost}>게시물 추가</Button>
      </div>
    </DialogContent>
  </Dialog>
)
