export interface PostsTableProps {
  posts: any[];
  highlightText: (text: string, highlight: string) => React.ReactNode;
  onUserClick: (user: any) => void;
  onPostDetail: (post: any) => void;
  onEditPost: (post: any) => void;
  onDeletePost: (id: number) => void;
}
