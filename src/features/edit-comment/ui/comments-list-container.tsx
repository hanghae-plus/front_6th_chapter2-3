import { Plus } from "lucide-react";
import { useCallback } from "react";

import { CommentList } from "@/entities/comment";
import { useComments } from "@/entities/comment";
import type { Comment } from "@/entities/comment";
import { Button } from "@/shared/ui/button";

import { useEditCommentDialog } from "../index";
import { useCommentEditor } from "../model/edit-comment.hook";

interface CommentsListContainerProps {
  postId?: number;
  searchQuery: string;
}

export function CommentsListContainer({ postId, searchQuery }: Readonly<CommentsListContainerProps>) {
  const { comments, setSelectedComment } = useComments();
  const { setIsEditOpen } = useEditCommentDialog();
  const { deleteComment, likeComment, prepareNewComment } = useCommentEditor();

  const handleEditComment = useCallback(
    (newComment: Comment) => {
      setSelectedComment(newComment);
      setIsEditOpen(true);
    },
    [setSelectedComment, setIsEditOpen],
  );

  if (!postId) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => postId && prepareNewComment(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <CommentList
        comments={comments[postId]}
        searchQuery={searchQuery}
        onLike={(id) => likeComment(id, postId)}
        onEdit={handleEditComment}
        onDelete={(id) => deleteComment(id, postId)}
      />
    </div>
  );
}
