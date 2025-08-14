import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui";
import { Post } from "../../../entities/post/types";
import { HighlightText } from "../../../shared/ui/HighlightText";

export const PostDetailDialog = ({
  showPostDetailDialog,
  setShowPostDetailDialog,
  selectedPost,
  searchQuery,
  Comments,
}: {
  showPostDetailDialog: boolean;
  setShowPostDetailDialog: (show: boolean) => void;
  selectedPost: Post | null;
  searchQuery: string;
  Comments: React.ReactNode;
}) => {
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <HighlightText text={selectedPost?.title ?? ""} highlight={searchQuery} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <HighlightText text={selectedPost?.body ?? ""} highlight={searchQuery} />
          </p>
          {Comments}
        </div>
      </DialogContent>
    </Dialog>
  );
};
