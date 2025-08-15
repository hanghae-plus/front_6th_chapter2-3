import { SelectLimit } from '@/features/filter-posts/ui/SelectLimit';
import { UI_CONSTANTS } from '@/shared/constants';
import { usePostsFilterStore } from '@/shared/lib';
import { Button } from '@/shared/ui';

export const PostPagination = () => {
  const {
    setSkip,
    pagination: { total, limit, skip },
  } = usePostsFilterStore();

  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-2'>
        <span>표시</span>
        <SelectLimit />
        <span>항목</span>
      </div>
      <div className='flex gap-2'>
        <Button
          disabled={skip === UI_CONSTANTS.PAGINATION.DEFAULT_SKIP}
          onClick={() =>
            setSkip(
              Math.max(UI_CONSTANTS.PAGINATION.DEFAULT_SKIP, skip - limit)
            )
          }
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
