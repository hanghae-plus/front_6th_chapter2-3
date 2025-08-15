import { Button } from "../../../shared/ui";
import { Plus } from "lucide-react";
import { Comment } from "../../../entities/comment/ui/Comment";
import { Comment as CommentType } from "../../../entities/comment/models/types";

export const Comments = ({
  comments,
  searchQuery,
  handleAddComment,
  handleLikeComment,
  handleDeleteComment,
  handleEditComment,
}: {
  comments: CommentType[];
  searchQuery: string;
  handleAddComment: () => void;
  handleLikeComment: (id: number, postId: number) => void;
  handleDeleteComment: (id: number, postId: number) => void;
  handleEditComment: (comment: CommentType) => void;
}) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={handleAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => {
          return (
            <Comment
              key={comment.id}
              comment={comment}
              searchQuery={searchQuery}
              handleLikeComment={() => handleLikeComment(comment.id, comment.postId ?? 0)}
              handleDeleteComment={() => handleDeleteComment(comment.id, comment.postId ?? 0)}
              handleEditComment={() => handleEditComment(comment)}
            />
          );
        })}
      </div>
    </div>
  );
};
