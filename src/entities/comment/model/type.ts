export interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
  };
}

export interface CommentState {
  comments: Record<number, Comment[]>; // postId를 key로 하는 댓글 배열
  selectedComment: Comment | null;
  newComment: {
    body: string;
    postId: number | null;
    userId: number;
  };
  setComments: (comments: Record<number, Comment[]>) => void;
  setSelectedComment: (comment: Comment | null) => void;
  setNewComment: (comment: any) => void;
  setCommentsForPost: (postId: number, comments: Comment[]) => void;
  addCommentToPost: (postId: number, comment: Comment) => void;
  updateCommentInPost: (postId: number, commentId: number, updatedComment: Comment) => void;
  removeCommentFromPost: (postId: number, commentId: number) => void;
}
