import {
  useLimit,
  useSearchQuery,
  useSkip,
  useSortBy,
  useSortOrder,
  useTag,
} from '../model';
import { POST_QUERY_KEYS } from './query-keys';

export const usePostsQueryKey = () => {
  const [limit] = useLimit();
  const [skip] = useSkip();
  const [searchQuery] = useSearchQuery();
  const [selectedTag] = useTag();
  const [sortBy] = useSortBy();
  const [sortOrder] = useSortOrder();

  return POST_QUERY_KEYS.posts(
    limit,
    skip,
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
  );
};
