import { SearchInputFilter, SortBySelectFilter, SortOrderSelectFilter, TagSelectFilter } from "../../../features"

export const PostFilter = () => {
  return (
    <div className='flex gap-4'>
    <SearchInputFilter />
    <TagSelectFilter />
    <SortBySelectFilter />
    <SortOrderSelectFilter />
  </div>
  )
}