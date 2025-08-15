import { Card } from '@/shared/ui/card';
import PostHeaderAdd from '@/widgets/PostHeaderAdd.tsx';
import PostContent from '@/widgets/PostContent.tsx';
import { useURLSync } from '@/features/posts/lib/useURLSync.ts';
import Dialog from '@/widgets/Dialog.tsx';

// 쥬스탄드 탄스탁 적용끝
const PostsManager = () => {
  useURLSync();

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostHeaderAdd />
      <PostContent />
      <Dialog />
    </Card>
  );
};

export default PostsManager;
