import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react';
import { useCommentStore } from '../model/store';
import { useComments, useGetComment } from '../model/hooks.ts';
import { Button } from '@/shared/ui/button';
import { highlightText } from '@/shared/lib/highlightText.tsx';

const Comments = ({
  postId,
  searchValue,
}: {
  postId: number;
  searchValue: string;
}) => {
  const {
    setSelectedComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    resetNewComment,
  } = useCommentStore();
  const { data } = useGetComment(postId);

  const { deleteComment } = useComments();
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            resetNewComment();
            setShowAddCommentDialog(true);
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {data?.comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-center justify-between text-sm border-b pb-1"
          >
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">
                {comment.user.username}:
              </span>
              <span className="truncate">
                {highlightText(comment.body, searchValue)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                // onClick={() => likeComment(comment.id, postId)}
              >
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment);
                  setShowEditCommentDialog(true);
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteComment.mutate({ id: comment.id, postId })}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
