import { Plus } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../shared/ui';
import { ReactNode } from 'react';

interface PostManagerProps {
  onAddPost: () => void;
  children: ReactNode;
}

export const PostManager = ({ onAddPost, children }: PostManagerProps) => {
  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <Button onClick={onAddPost}>
            <Plus className='w-4 h-4 mr-2' />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>{children}</div>
      </CardContent>
    </Card>
  );
};
