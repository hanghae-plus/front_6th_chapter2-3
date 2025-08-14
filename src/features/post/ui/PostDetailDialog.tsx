import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui";
import { Post } from "../../../entities/post/types";
import { HighlightText } from "../../../shared/ui/HighlightText";
import { showPostDetailDialogAtom } from "../models/dialog.atoms";
import { useAtom } from "jotai";

export const PostDetailDialog = ({
  selectedPost,
  searchQuery,
  bottom,
}: {
  selectedPost: Post | null;
  searchQuery: string;
  bottom: React.ReactNode;
}) => {
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom);
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
          {bottom}
        </div>
      </DialogContent>
    </Dialog>
  );
};
