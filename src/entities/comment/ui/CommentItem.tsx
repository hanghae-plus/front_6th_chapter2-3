import { IComment } from '../model/type';
import { Edit2, ThumbsUp, Trash2 } from 'lucide-react';
import { Button } from '../../../shared/ui/components';
import { HighlightText } from '../../../shared/ui/HighlightText';

interface CommentItemProps {
  // 댓글 데이터
  comment: IComment;
  // 하이라이트 처리 검색어
  searchQuery: string;

  // 댓글 좋아요
  onLikeComment: (comment: IComment) => void;
  // 댓글 수정
  onEditComment: (comment: IComment) => void;
  // 댓글 삭제
  onDeleteComment: (comment: IComment) => void;
}

const CommentItem = ({
  comment,
  searchQuery,
  onLikeComment,
  onEditComment,
  onDeleteComment,
}: CommentItemProps) => {
  return (
    <div
      key={comment.id}
      className="flex items-center justify-between text-sm border-b pb-1"
    >
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">
          {HighlightText(comment.body, searchQuery)}
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLikeComment(comment)}
        >
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditComment(comment)}
        >
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteComment(comment)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default CommentItem;
