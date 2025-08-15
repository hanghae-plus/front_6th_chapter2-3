import { Edit2 } from 'lucide-react';
import { useDialogStore, useSelectedPostStore } from '../model';
import { Post } from '@/entities/posts';
import { Button } from '@/shared/ui/button';

const PostTableEditingButton = ({ post }: { post: Post }) => {
  const { setSelectedPost } = useSelectedPostStore();
  const { setShowEditDialog } = useDialogStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        setSelectedPost(post);
        setShowEditDialog(true);
      }}
    >
      <Edit2 className="w-4 h-4" />
    </Button>
  );
};

export default PostTableEditingButton;
