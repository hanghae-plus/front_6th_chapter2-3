import { Plus } from 'lucide-react';
import React from 'react';

import { useDialogState } from '../../entities/post/model/hooks';
import { Button, CardHeader, CardTitle } from '../../shared/ui';

type Props = { title: string };

const PostsHeader: React.FC<Props> = ({ title }) => {
  const { setShowAddDialog } = useDialogState();

  return (
    <CardHeader>
      <CardTitle className='flex items-center justify-between'>
        <span>{title}</span>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className='w-4 h-4 mr-2' />
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  );
};

export default PostsHeader;
