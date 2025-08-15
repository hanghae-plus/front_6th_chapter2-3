import PostFilter from './PostFilter.tsx';

import { Card } from '@/shared/ui/card';
import { PostTable } from '@/features/posts';

const PostContent = () => {
  return (
    <Card.Content>
      <div className="flex flex-col gap-4">
        <PostFilter />
        <PostTable />
      </div>
    </Card.Content>
  );
};

export default PostContent;
