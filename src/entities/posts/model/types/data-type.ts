// 개별 게시글의 반응 정보
export interface PostReactions {
  likes: number;
  dislikes: number;
}

// 개별 게시글 데이터
export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: PostReactions;
  views: number;
  userId: number;
}

// 개별 게시글의 댓글 데이터
export interface PostComment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

// 게시글 태그 데이터
export interface PostTag {
  slug: string;
  name: string;
  url: string;
}
