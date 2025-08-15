import { MessageSquare } from 'lucide-react';
import { useDialogStore, useSelectedPostStore } from '../model';
import { Post } from '@/entities/posts';
import { Button } from '@/shared/ui/button';

const PostTableDetailButton = ({ post }: { post: Post }) => {
  const { setShowDetailDialog } = useDialogStore();
  const { setSelectedPost } = useSelectedPostStore();

  console.log('SelectedPost', post);
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        setSelectedPost(post);
        setShowDetailDialog(true);
      }}
    >
      <MessageSquare className="w-4 h-4" />
    </Button>
  );
};

export default PostTableDetailButton;
