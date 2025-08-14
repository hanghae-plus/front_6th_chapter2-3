import { MessageSquare } from 'lucide-react';
import { usePostDialog } from '../model';
import {
  AddCommentButton,
  DeleteCommentButton,
  EditCommentButton,
  ReactionComment,
} from '../ui';
import { usePostComments, useSearchQuery, type Post } from '@/entities/posts';
import { highlightText } from '@/shared/lib';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';

interface OpenPostDialogButtonProps {
  post: Post;
}

// 게시물 상세 버튼
export const OpenPostDialogButton = ({ post }: OpenPostDialogButtonProps) => {
  const { open: openPostDialog } = usePostDialog();

  return (
    <Button variant="ghost" size="sm" onClick={() => openPostDialog(post)}>
      <MessageSquare className="w-4 h-4" />
    </Button>
  );
};

// 게시물 상세 다이얼로그
export const PostDialog = () => {
  const [searchQuery] = useSearchQuery();
  const { opened, data: post, close } = usePostDialog();
  const { data: comments } = usePostComments(post?.id);

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
              <AddCommentButton postId={post.id} userId={1} />
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

                  {/* 댓글 액션 */}
                  <div className="flex items-center space-x-1">
                    {/* 댓글 좋아요 */}
                    <ReactionComment
                      commentId={comment.id}
                      postId={post.id}
                      likes={comment.likes}
                    />

                    {/* 댓글 수정 */}
                    <EditCommentButton comment={comment} />

                    {/* 댓글 삭제 */}
                    <DeleteCommentButton
                      commentId={comment.id}
                      postId={post.id}
                    />
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
