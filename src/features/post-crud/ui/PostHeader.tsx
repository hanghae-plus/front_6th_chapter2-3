import { Plus } from 'lucide-react';

import React from 'react';

import { Button, CardHeader, CardTitle } from '../../../shared/ui';

interface PostHeaderProps {
  onAddPost: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ onAddPost }) => {
  return (
    <CardHeader>
      <CardTitle className='flex items-center justify-between'>
        <span>게시물 관리자</span>
        <Button onClick={onAddPost}>
          <Plus className='mr-2 h-4 w-4' />
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  );
};

export default PostHeader;