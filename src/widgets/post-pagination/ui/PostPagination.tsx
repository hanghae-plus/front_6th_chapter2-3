import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/ui/components';
import { useQueryParameter } from '../../../shared/hook/useQueryParameter';
import { usePostsQuery } from '../../../entities/post/model/hook';

const PostPagination = () => {
  const { skip, setSkip, limit, setLimit } = useQueryParameter();
  // 태그 및 검색어 있을 때 total 처리 필요 (sortBy, sortOrder 처리?)
  const { data: posts } = usePostsQuery(limit, skip);

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
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
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
          disabled={skip + limit >= (posts?.total ?? 0)}
          onClick={() => setSkip(skip + limit)}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default PostPagination;
