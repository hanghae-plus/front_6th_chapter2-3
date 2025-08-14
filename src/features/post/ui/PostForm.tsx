import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from '../../../shared/ui';
import { Post, NewPost } from '../../../entities/post';

interface PostFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  post: Post | NewPost;
  onPostChange: (post: Post | NewPost) => void;
  onSubmit: () => void;
  submitText: string;
  isEdit?: boolean;
}

export const PostForm = ({
  isOpen,
  onOpenChange,
  title,
  post,
  onPostChange,
  onSubmit,
  submitText,
  isEdit = false,
}: PostFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='제목'
            value={post.title}
            onChange={(e) => onPostChange({ ...post, title: e.target.value })}
          />
          <Textarea
            rows={isEdit ? 15 : 30}
            placeholder='내용'
            value={post.body}
            onChange={(e) => onPostChange({ ...post, body: e.target.value })}
          />
          {!isEdit && (
            <Input
              type='number'
              placeholder='사용자 ID'
              value={(post as NewPost).userId}
              onChange={(e) => onPostChange({ ...post, userId: Number(e.target.value) })}
            />
          )}
          <Button onClick={onSubmit}>{submitText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
