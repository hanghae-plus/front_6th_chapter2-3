import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/shared/ui/card';
import PostHeaderAdd from '@/widgets/PostHeaderAdd.tsx';
import PostContent from '@/widgets/PostContent.tsx';

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // 상태 관리

  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'));
  const [limit, setLimit] = useState(
    parseInt(queryParams.get('limit') || '10'),
  );
  const [searchQuery, setSearchQuery] = useState(
    queryParams.get('search') || '',
  );

  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState(
    queryParams.get('sortOrder') || 'asc',
  );

  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || '');

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set('skip', skip.toString());
    if (limit) params.set('limit', limit.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);
    navigate(`?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || 'asc');
    setSelectedTag(params.get('tag') || '');
  }, [location.search]);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostHeaderAdd />
      <PostContent />
    </Card>
  );
};

export default PostsManager;
