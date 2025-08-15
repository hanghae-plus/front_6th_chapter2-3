import {
  PostSearchBar,
  PostTagFilter,
  PostFilterSortBy,
  PostFilterSortOrder,
} from '@/features/posts';

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
