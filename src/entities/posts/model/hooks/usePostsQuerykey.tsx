import {
  useLimit,
  useSearchQuery,
  useSkip,
  useSortBy,
  useSortOrder,
  useTag,
} from '../hooks';
import { QUERY_KEYS } from '@/shared/config';

export const usePostsQueryKey = () => {
  const [limit] = useLimit();
  const [skip] = useSkip();
  const [searchQuery] = useSearchQuery();
  const [selectedTag] = useTag();
  const [sortBy] = useSortBy();
  const [sortOrder] = useSortOrder();

  return QUERY_KEYS.posts(
    limit,
    skip,
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
  );
};
