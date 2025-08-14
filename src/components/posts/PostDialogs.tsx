import { FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from "@/components";
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react";
import type { Post, Comment, UserDetails } from "@/types";

// Add/Edit Post Dialog
interface PostFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: FormEvent) => void;
  post: { title: string; body: string; userId?: number };
  setPost: (post: any) => void;
  isEdit?: boolean;
}

export const PostFormDialog = ({ open, onOpenChange, onSubmit, post, setPost, isEdit = false }: PostFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? "게시물 수정" : "새 게시물 추가"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          placeholder="제목"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
        />
        <Textarea
          placeholder="내용"
          value={post.body}
          onChange={(e) => setPost({ ...post, body: e.target.value })}
          required
          rows={10}
        />
        {!isEdit && (
          <Input
            type="number"
            placeholder="사용자 ID"
            value={post.userId}
            onChange={(e) => setPost({ ...post, userId: Number(e.target.value) })}
            required
          />
        )}
        <Button type="submit">{isEdit ? "게시물 업데이트" : "게시물 추가"}</Button>
      </form>
    </DialogContent>
  </Dialog>
);

// Post Detail Dialog
interface PostDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  comments: Comment[];
  highlightText: (text: string, highlight: string) => React.ReactNode;
  onCommentAdd: () => void;
  onCommentEdit: (comment: Comment) => void;
  onCommentDelete: (postId: number, commentId: number) => void;
  onCommentLike: (postId: number, commentId: number) => void;
}

export const PostDetailDialog = ({ open, onOpenChange, post, comments, highlightText, onCommentAdd, onCommentEdit, onCommentDelete, onCommentLike }: PostDetailDialogProps) => {
    if (!post) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{highlightText(post.title, "")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <p className="whitespace-pre-wrap">{highlightText(post.body, "")}</p>
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">댓글</h3>
                            <Button size="sm" onClick={onCommentAdd}>
                                <Plus className="w-3 h-3 mr-1" />
                                댓글 추가
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {comments?.map((comment) => (
                                <div key={comment.id} className="flex items-start justify-between text-sm border-b pb-2">
                                    <div className="flex items-center space-x-2 overflow-hidden">
                                        <span className="font-medium">{comment.user.username}:</span>
                                        <span className="truncate">{comment.body}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 flex-shrink-0">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCommentLike(post.id, comment.id)}>
                                            <ThumbsUp className="w-3 h-3" />
                                            <span className="ml-1 text-xs">{comment.likes}</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCommentEdit(comment)}>
                                            <Edit2 className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCommentDelete(post.id, comment.id)}>
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
    )
};

// Add/Edit Comment Dialog
interface CommentFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: FormEvent) => void;
    commentBody: string;
    setCommentBody: (body: string) => void;
    isEdit?: boolean;
}

export const CommentFormDialog = ({ open, onOpenChange, onSubmit, commentBody, setCommentBody, isEdit = false }: CommentFormDialogProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isEdit ? "댓글 수정" : "새 댓글 추가"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
                <Textarea
                    placeholder="댓글 내용"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    required
                />
                <Button type="submit">{isEdit ? "댓글 업데이트" : "댓글 추가"}</Button>
            </form>
        </DialogContent>
    </Dialog>
);

// User Detail Modal
interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserDetails | null;
}

export const UserDialog = ({ open, onOpenChange, user }: UserDialogProps) => {
    if (!user) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>사용자 정보</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <img src={user.image} alt={user.username} className="w-24 h-24 rounded-full mx-auto" />
                    <h3 className="text-xl font-semibold text-center">{user.username}</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong>이름:</strong> {user.firstName} {user.lastName}</p>
                        <p><strong>나이:</strong> {user.age}</p>
                        <p><strong>이메일:</strong> {user.email}</p>
                        <p><strong>전화번호:</strong> {user.phone}</p>
                        <p><strong>주소:</strong> {user.address?.address}, {user.address?.city}</p>
                        <p><strong>직장:</strong> {user.company?.name} - {user.company?.title}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
};
