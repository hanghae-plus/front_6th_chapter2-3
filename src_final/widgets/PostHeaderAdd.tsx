import PostAddTrigger from '../features/posts/ui/PostAddTrigger.tsx';
import { Card } from '@/shared/ui/card';

const PostHeaderAdd = () => {
  return (
    <Card.Header>
      <Card.Title className="flex items-center justify-between">
        <span>게시물 관리자</span>
        <PostAddTrigger />
      </Card.Title>
    </Card.Header>
  );
};

export default PostHeaderAdd;
