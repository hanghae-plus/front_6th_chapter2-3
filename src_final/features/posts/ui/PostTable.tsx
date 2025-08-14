import PostTableItem from './PostTableItem.tsx';
import { useGetPosts, usePostFilterStore, useSearchStore } from '../model';

import { Table } from '@/shared/ui/table';
import Pagination from './Pagination.tsx';

const PostListTable = () => {
  const { skip, limit, selectedTag } = usePostFilterStore();
  const { searchQuery } = useSearchStore();

  const { data, isLoading } = useGetPosts({
    limit,
    skip,
    tag: selectedTag,
    searchQuery,
  });
  return (
    <>
      {!isLoading ? (
        <Table.Root>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-[50px]">ID</Table.Head>
                <Table.Head>제목</Table.Head>
                <Table.Head className="w-[150px]">작성자</Table.Head>
                <Table.Head className="w-[150px]">반응</Table.Head>
                <Table.Head className="w-[150px]">작업</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.posts.map((post) => (
                <PostTableItem
                  key={post.id}
                  post={post}
                  searchQuery={searchQuery}
                />
              ))}
            </Table.Body>
          </Table>
        </Table.Root>
      ) : (
        <div className="flex justify-center p-4">로딩 중...</div>
      )}
      <Pagination total={data?.total || 0} />
    </>
  );
};

export default PostListTable;
