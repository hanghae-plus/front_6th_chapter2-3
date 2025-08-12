import { IPost } from '../model/type';
import { TableBody } from '../../../shared/ui/components';
import PostItem from './PostItem';

interface PostListProps {
  // 게시물 목록
  posts?: IPost[];
  // 하이라이트 처리 검색어
  searchQuery: string;
  // 게시물 필터 태그
  selectedTag: string;

  // 유저 클릭 함수
  onClickUser: () => void;
  // 게시물 상세보기 함수
  onClickPost: () => void;

  // 태그 클릭 함수
  onClickTag: (value: string) => void;
  // 게시물 수정
  onUpdatePost: () => void;
  // 게시물 삭제
  onDeletePost: (id: number) => void
}

const PostList = ({
  posts,
  searchQuery,
  selectedTag,
  onClickUser,
  onClickPost,
  onClickTag,
  onUpdatePost,
  onDeletePost,
}: PostListProps) => {
  return (
    <TableBody>
      {posts?.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
          onClickUser={onClickUser}
          onClickPost={onClickPost}
          onClickTag={onClickTag}
          onUpdatePost={onUpdatePost}
          onDeletePost={onDeletePost}
        />
      ))}
    </TableBody>
  );
};

export default PostList;
