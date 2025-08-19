import { useLimit, usePosts } from '@/entities/posts';
import { useSkip } from '@/entities/posts';
import { Button, Select, SelectTrigger, SelectValue } from '@/shared/ui';
import { SelectOptions } from '@/shared/ui/Select';

export const PostsPagination = () => {
  const [skip, setSkip] = useSkip();
  const [limit, setLimit] = useLimit();
  const { data: postsData } = usePosts();
  const total = postsData?.total ?? 0;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select
          value={limit.toString()}
          onValueChange={(value) => setLimit(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectOptions
            options={[
              { value: '10', name: '10' },
              { value: '20', name: '20' },
              { value: '30', name: '30' },
            ]}
          />
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button
          disabled={skip === 0}
          onClick={() => setSkip(Math.max(0, skip - limit))}
        >
          이전
        </Button>
        <Button
          disabled={skip + limit >= total}
          onClick={() => setSkip(skip + limit)}
        >
          다음
        </Button>
      </div>
    </div>
  );
};
