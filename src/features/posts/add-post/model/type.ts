export interface AddPostDialogProps {
  newPost: {
    title: string;
    body: string;
    userId: number;
  };
  onPostChange: (post: { title: string; body: string; userId: number }) => void;
  onSubmit: () => void;
}
