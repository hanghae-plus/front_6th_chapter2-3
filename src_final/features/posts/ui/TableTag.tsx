import { usePostFilterStore } from '../model';
import { PostTag } from '@/entities/posts';

const TableTag = ({ tags }: { tags: PostTag['slug'][] }) => {
  const { selectedTag, setFilter } = usePostFilterStore();
  return (
    <div className="flex flex-wrap gap-1">
      {tags?.map((tag) => (
        <span
          key={tag}
          className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
            selectedTag === tag
              ? 'text-white bg-blue-500 hover:bg-blue-600'
              : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
          }`}
          onClick={() => {
            // setSelectedTag(tag);
            setFilter('selectedTag', tag);
            // updateURL();
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TableTag;
