import { useManagedPosts } from '../model/useManagedPosts';

import { PostTable } from '@/entities/post/ui/PostTable';
import { CreatePostButton, PostSearch, PostFilter, Pagination } from '@/features';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';

export const PostListManager = () => {
  const { posts, total, isLoading } = useManagedPosts();

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <CreatePostButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <div className='flex gap-4'>
            <PostSearch />
            <PostFilter />
          </div>
          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTable posts={posts} />
          )}
          {/* 페이지네이션 */}
          <Pagination total={total} />
        </div>
      </CardContent>
    </Card>
  );
};
