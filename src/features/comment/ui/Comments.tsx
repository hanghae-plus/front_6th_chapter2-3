import { Button } from "@/shared/ui";
import { CommentType } from "@/entities/comment/model/types";
import { Plus, ThumbsUp, Trash2, Edit2 } from "lucide-react";
import { Comment } from "@/entities/comment/ui";
import {
  useDeleteCommentMutation,
  useLikeCommentMutation,
} from "@/entities/comment/api/hooks";
import { useGetCommentsQuery } from "@/entities/comment/api/hooks";
import { highlightText } from "@/shared/lib/highlightText";
import { useState } from "react";
import { CommentAddDialog } from "./CommentAddDialog";
import { CommentEditDialog } from "./CommentEditDialog";

interface CommentsProps {
  postId: number;
  searchQuery: string;
}

export const Comments = ({ postId, searchQuery }: CommentsProps) => {
  const [showCommentAddDialog, setShowCommentAddDialog] = useState(false);
  const [showCommentEditDialog, setShowCommentEditDialog] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null,
  );

  const { data: commentsData } = useGetCommentsQuery(postId);
  const deleteCommentMutation = useDeleteCommentMutation();
  const likeCommentMutation = useLikeCommentMutation();

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(
      { id: commentId, postId },
      {
        onError: (error) => {
          console.error("댓글 삭제 실패:", error);
          alert("댓글 삭제에 실패했습니다.");
        },
      },
    );
  };

  const handleLikeComment = (commentId: number, currentLikes: number) => {
    likeCommentMutation.mutate(
      { id: commentId, currentLikes, postId },
      {
        onError: (error) => {
          console.error("댓글 좋아요 실패:", error);
          alert("댓글 좋아요에 실패했습니다.");
        },
      },
    );
  };

  const handleEditComment = (comment: CommentType) => {
    setSelectedComment(comment);
    setShowCommentEditDialog(true);
  };

  const comments = commentsData?.comments || [];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setShowCommentAddDialog(true);
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment: CommentType) => (
          <div
            key={comment.id}
            className="flex items-center justify-between text-sm border-b pb-1"
          >
            <Comment
              comment={comment}
              highlightText={highlightText}
              searchQuery={searchQuery}
            />
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeComment(comment.id, comment.likes)}
              >
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditComment(comment)}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteComment(comment.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 댓글 추가 */}
      {showCommentAddDialog && (
        <CommentAddDialog
          open={showCommentAddDialog}
          onClose={() => setShowCommentAddDialog(false)}
          postId={postId}
        />
      )}

      {/* 댓글 수정 */}
      <CommentEditDialog
        open={showCommentEditDialog}
        onClose={() => setShowCommentEditDialog(false)}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
      />
    </div>
  );
};
