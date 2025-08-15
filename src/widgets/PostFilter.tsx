import {
  PostSearchBar,
  PostTagFilter,
  PostFilterSortBy,
  PostFilterSortOrder,
} from '@/features/posts';
// 필터 위젯
const PostFilter = () => {
  return (
    <div className="flex gap-4">
      <PostSearchBar />
      <PostTagFilter />
      <PostFilterSortBy />
      <PostFilterSortOrder />
    </div>
  );
};

export default PostFilter;
