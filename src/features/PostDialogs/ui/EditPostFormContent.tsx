import React from 'react';

import type { Post } from '../../../entities/post/model/types';
import { Button, Input, Textarea } from '../../../shared/ui';

export const EditPostFormContent: React.FC<{
  selectedPost: Post | null;
  setSelectedPost: (v: Post) => void;
  onSubmit: () => void;
}> = ({ selectedPost, setSelectedPost, onSubmit }) => (
  <div className='space-y-4'>
    <Input
      placeholder='제목'
      value={selectedPost?.title || ''}
      onChange={(e) => selectedPost && setSelectedPost({ ...selectedPost, title: e.target.value })}
    />
    <Textarea
      rows={15}
      placeholder='내용'
      value={selectedPost?.body || ''}
      onChange={(e) => selectedPost && setSelectedPost({ ...selectedPost, body: e.target.value })}
    />
    <Button onClick={onSubmit}>게시물 업데이트</Button>
  </div>
);
