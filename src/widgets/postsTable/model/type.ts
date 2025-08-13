export interface PostsTableProps {
  posts: any[];
  searchQuery: string;
  selectedTag: string;
  highlightText: (text: string, highlight: string) => React.ReactNode;
  onTagClick: (tag: string) => void;
  onUserClick: (user: any) => void;
  onPostDetail: (post: any) => void;
  onEditPost: (post: any) => void;
  onDeletePost: (id: number) => void;
}
