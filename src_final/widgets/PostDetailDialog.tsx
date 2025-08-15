import {
  useDialogStore,
  useSearchStore,
  useSelectedPostStore,
} from '../features/posts/model/store';

import { highlightText } from '@/shared/lib/highlightText.tsx';
import { Dialog } from '@/shared/ui/dialog';
import { Comments } from '@/features/comments';

const PostDetailDialog = () => {
  const { showDetailDialog, setShowDetailDialog } = useDialogStore();
  const { selectedPost } = useSelectedPostStore();
  const { searchValue } = useSearchStore();
  return (
    <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
      <Dialog.Content className="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>
            {highlightText(selectedPost?.title as string, searchValue)}
          </Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body as string, searchValue)}</p>
          <Comments
            postId={selectedPost?.id as number}
            searchValue={searchValue}
          />
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default PostDetailDialog;
