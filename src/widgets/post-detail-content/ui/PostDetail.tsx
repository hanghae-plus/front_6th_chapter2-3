import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react';
import {
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../shared/ui/components';
import { HighlightText } from '../../../shared/ui/HighlightText';
import { useDialogStore } from '../../../shared/hook/useDialogStore';
import { IPost } from '../../../entities/post/model/type';
import { useCommentsQuery } from '../../../entities/comment/model/hook';
import AddCommentForm from '../../../features/comment/add-comment/ui/AddCommentForm';
import { useLikeComment } from '../../../features/comment/like-comment/model/useLikeComment';
import UpdateCommentform from '../../../features/comment/update-comment/ui/UpdateCommentForm';
import { IComment } from '../../../entities/comment/model/type';
import { useDeleteComment } from '../../../features/comment/delete-comment/model/useDeleteComment';

interface PostDetailProps {
  post: IPost;
  searchQuery: string;
}

const PostDetail = ({ post, searchQuery }: PostDetailProps) => {
  const setShow = useDialogStore((state) => state.setShow);
  const setContent = useDialogStore((state) => state.setContent);

  const postId = post.id;
  const { data: comments } = useCommentsQuery(postId);

  const handleAddComment = () => {
    setShow(true);
    setContent(<AddCommentForm postId={postId} />);
  };

  const handleUpdateComment = (comment: IComment) => {
    setShow(true);
    setContent(<UpdateCommentform comment={comment} />);
  };

  const { deleteComment } = useDeleteComment();
  const { likeComment } = useLikeComment();

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>
          {HighlightText(post?.title ?? '', searchQuery)}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p>{HighlightText(post?.body ?? '', searchQuery)}</p>
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">댓글</h3>
            <Button size="sm" onClick={handleAddComment}>
              <Plus className="w-3 h-3 mr-1" />
              댓글 추가
            </Button>
          </div>

          {/* CommentList */}
          <div className="space-y-1">
            {comments?.comments?.map((comment) => (
              // CommentItem
              <div
                key={comment.id}
                className="flex items-center justify-between text-sm border-b pb-1"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <span className="font-medium truncate">
                    {comment.user.username}:
                  </span>
                  <span className="truncate">
                    {HighlightText(comment.body, searchQuery)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likeComment(comment)}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="ml-1 text-xs">{comment.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateComment(comment)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteComment(comment.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default PostDetail;
