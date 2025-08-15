import { Trash2 } from 'lucide-react';
import { usePosts } from '../model';
import { Post } from '@/entities/posts';
import { Button } from '@/shared/ui/button';

const PostTableDeleteButton = ({ post }: { post: Post }) => {
  const { deletePost } = usePosts();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => deletePost.mutate(post.id)}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
};

export default PostTableDeleteButton;
