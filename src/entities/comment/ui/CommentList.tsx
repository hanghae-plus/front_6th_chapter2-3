import { IComment } from '../model/type';
import CommentItem from './CommentItem';

interface CommentListProps {
  // 댓글 목록
  comments?: IComment[];
  // 하이라이트 처리 검색어
  searchQuery: string;

  // 댓글 좋아요
  onLikeComment: (comment: IComment) => void;
  // 댓글 수정
  onEditComment: (comment: IComment) => void;
  // 댓글 삭제
  onDeleteComment: (comment: IComment) => void;
}

const CommentList = ({
  comments,
  searchQuery,
  onLikeComment,
  onEditComment,
  onDeleteComment,
}: CommentListProps) => {
  return (
    <div className="space-y-1">
      {comments?.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          searchQuery={searchQuery}
          onLikeComment={onLikeComment}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
};

export default CommentList;
