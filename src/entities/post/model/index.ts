import {
  Post,
  PostWithUser,
  Comment,
  User,
  PostsResponse,
  CommentsResponse,
  TagsResponse,
  NewPost,
  NewComment,
} from '../types';

// 게시물과 사용자 정보를 결합하는 함수
export const combinePostsWithUsers = (posts: Post[], users: User[]): PostWithUser[] => {
  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }));
};

// 게시물 검색 하이라이트 함수
export const highlightText = (text: string, highlight: string): string => {
  if (!text || !highlight.trim()) {
    return text;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// 게시물 정렬 함수
export const sortPosts = (
  posts: PostWithUser[],
  sortBy: string,
  sortOrder: 'asc' | 'desc',
): PostWithUser[] => {
  if (!sortBy || sortBy === 'none') return posts;

  const sortedPosts = [...posts].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'reactions':
        aValue = (a.reactions?.likes || 0) + (a.reactions?.dislikes || 0);
        bValue = (b.reactions?.likes || 0) + (b.reactions?.dislikes || 0);
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return sortedPosts;
};

// 게시물 필터링 함수
export const filterPostsByTag = (posts: PostWithUser[], tag: string): PostWithUser[] => {
  if (!tag || tag === 'all') return posts;
  return posts.filter((post) => post.tags?.includes(tag));
};

// 게시물 검색 함수
export const searchPosts = (posts: PostWithUser[], searchQuery: string): PostWithUser[] => {
  if (!searchQuery.trim()) return posts;

  const query = searchQuery.toLowerCase();
  return posts.filter(
    (post) => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query),
  );
};

// 댓글 관련 유틸리티 함수들
export const addCommentToPost = (
  comments: Record<number, Comment[]>,
  comment: Comment,
): Record<number, Comment[]> => {
  return {
    ...comments,
    [comment.postId]: [...(comments[comment.postId] || []), comment],
  };
};

export const updateCommentInPost = (
  comments: Record<number, Comment[]>,
  commentId: number,
  postId: number,
  updatedComment: Comment,
): Record<number, Comment[]> => {
  return {
    ...comments,
    [postId]: comments[postId].map((comment) =>
      comment.id === commentId ? updatedComment : comment,
    ),
  };
};

export const removeCommentFromPost = (
  comments: Record<number, Comment[]>,
  commentId: number,
  postId: number,
): Record<number, Comment[]> => {
  return {
    ...comments,
    [postId]: comments[postId].filter((comment) => comment.id !== commentId),
  };
};

export const updateCommentLikes = (
  comments: Record<number, Comment[]>,
  commentId: number,
  postId: number,
  newLikes: number,
): Record<number, Comment[]> => {
  return {
    ...comments,
    [postId]: comments[postId].map((comment) =>
      comment.id === commentId ? { ...comment, likes: newLikes } : comment,
    ),
  };
};
