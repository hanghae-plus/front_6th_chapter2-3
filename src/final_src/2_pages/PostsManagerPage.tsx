import React from 'react';

import { AddCommentDialog } from '@/features/comment-management';
import { EditCommentFormDialog } from '@/features/comment-management/ui/EditCommentFormDialog';
import { Filters } from '@/features/filter-posts';
import {
  AddPostButton,
  PostDetailDialog,
  PostTable,
} from '@/features/post-management';
import { AddPostFormDialog } from '@/features/post-management/ui/AddPostFormDialog';
import { EditPostFormDialog } from '@/features/post-management/ui/EditPostFormDialog';
import { PostPagination } from '@/features/post-management/ui/PostPagination';
import { UserProfileDialog } from '@/features/user-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';

export const PostsManagerPage = () => {
  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <AddPostButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          <Filters />
          <PostTable />
          <PostPagination />
        </div>
      </CardContent>

      {/* 다이얼로그 컴포넌트들 */}
      <AddPostFormDialog />
      <EditPostFormDialog />
      <AddCommentDialog />
      <EditCommentFormDialog />
      <PostDetailDialog />
      <UserProfileDialog />
    </Card>
  );
};
