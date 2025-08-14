import { PostType, useUpdatePost } from '../../../entities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
  Button,
  Input,
} from '../../../shared';

interface UpdatePostModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPost: PostType;
  handleChangePost: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}

export const UpdatePostModal = ({
  isOpen,
  onOpenChange,
  selectedPost,
  handleChangePost,
}: UpdatePostModalProps) => {
  const { mutate: updatePost } = useUpdatePost();

  const handleUpdatePost = () => {
    updatePost({
      id: selectedPost.id,
      title: selectedPost.title,
      body: selectedPost.body,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input placeholder='제목' value={selectedPost?.title || ''} onChange={handleChangePost} name='title' />
          <Textarea
            rows={15}
            placeholder='내용'
            value={selectedPost?.body || ''}
            onChange={handleChangePost}
            name='body'
          />
          <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
