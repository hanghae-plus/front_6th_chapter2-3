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
  fetchComments: (postId: number) => Promise<void>;
  addComment: () => Promise<void>;
  updateComment: () => Promise<void>;
  deleteComment: (id: number, postId: number) => Promise<void>;
  likeComment: (id: number, postId: number) => Promise<void>;
}
