import React from 'react';

import { Button, Input, Textarea } from '../../../shared/ui';

export const AddPostFormContent: React.FC<{
  newPost: { title: string; body: string; userId: number };
  setNewPost: (v: { title: string; body: string; userId: number }) => void;
  onSubmit: () => void;
}> = ({ newPost, setNewPost, onSubmit }) => (
  <div className='space-y-4'>
    <Input
      placeholder='제목'
      value={newPost.title}
      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
    />
    <Textarea
      rows={30}
      placeholder='내용'
      value={newPost.body}
      onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
    />
    <Input
      type='number'
      placeholder='사용자 ID'
      value={newPost.userId}
      onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
    />
    <Button onClick={onSubmit}>게시물 추가</Button>
  </div>
);
