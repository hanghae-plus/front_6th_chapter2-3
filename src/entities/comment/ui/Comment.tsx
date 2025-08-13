import { Edit2, ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "../../../shared/ui";
import { Comment as CommentType } from "../types";
import { HighlightText } from "../../../shared/ui/HighlightText";

export const Comment = ({
  comment,
  searchQuery,
  handleLikeComment,
  handleDeleteComment,
  handleEditComment,
}: {
  comment: CommentType;
  searchQuery: string;
  handleLikeComment: (commentId: number, postId: number) => void;
  handleDeleteComment: (commentId: number, postId: number) => void;
  handleEditComment: () => void;
}) => {
  return (
    <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">
          <HighlightText text={comment.body} highlight={searchQuery} />
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => handleLikeComment}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleEditComment}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDeleteComment}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
