import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/ui/components';
import { useQueryParameter } from '../../../shared/hook/useQueryParameter';
import { usePostListQuery } from '../../../entities/post/model/hook';

const PostPagination = () => {
  const { params, setters} = useQueryParameter();
  const { data: posts } = usePostListQuery(params);

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select
          value={params.limit.toString()}
          onValueChange={(value) => setters.setLimit(Number(value))}
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
          disabled={params.skip === 0}
          onClick={() => setters.setSkip(Math.max(0, params.skip - params.limit))}
        >
          이전
        </Button>
        <Button
          disabled={params.skip + params.limit >= (posts?.total ?? 0)}
          onClick={() => setters.setSkip(params.skip + params.limit)}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default PostPagination;
