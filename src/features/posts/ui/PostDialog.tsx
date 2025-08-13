import {
  useAddCommentDialog,
  useEditCommentDialog,
  usePostDialog,
} from '../model';
import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react';
import {
  usePostCommentDelete,
  usePostCommentLike,
  usePostComments,
  useSearchQuery,
} from '@/entities/posts';
import { highlightText } from '@/shared/lib';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';

export const PostDialog = () => {
  const [searchQuery] = useSearchQuery();
  const { opened, data: post, close } = usePostDialog();
  const { open: openAddCommentDialog } = useAddCommentDialog();
  const { data: comments } = usePostComments(post?.id);
  const { mutate: likeComment } = usePostCommentLike();
  const { mutate: deleteComment } = usePostCommentDelete();
  const { open: openEditCommentDialog } = useEditCommentDialog();

  if (!post) {
    return null;
  }

  return (
    <Dialog
      open={opened}
      onOpenChange={(opened) => {
        if (!opened) {
          close();
        }
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body, searchQuery)}</p>

          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">댓글</h3>
              <Button
                size="sm"
                onClick={() => {
                  openAddCommentDialog({
                    postId: post.id,
                    userId: 1,
                  });
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                댓글 추가
              </Button>
            </div>
            <div className="space-y-1">
              {comments?.comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-center justify-between text-sm border-b pb-1"
                >
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <span className="font-medium truncate">
                      {comment.user.username}:
                    </span>
                    <span className="truncate">
                      {highlightText(comment.body, searchQuery)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {/*  */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        likeComment({ commentId: comment.id, postId: post.id })
                      }
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span className="ml-1 text-xs">{comment.likes}</span>
                    </Button>
                    {/* 수정 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        openEditCommentDialog(comment);
                      }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        deleteComment({
                          commentId: comment.id,
                          postId: post.id,
                        })
                      }
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
    </Dialog>
  );
};
