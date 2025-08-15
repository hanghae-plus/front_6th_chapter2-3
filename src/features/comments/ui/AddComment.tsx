import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { useCommentStore } from '../model/store';
import { useComments } from '../model/hooks.ts';
// eslint-disable-next-line fsd/no-relative-imports
import { useSelectedPostStore } from '../../../features/posts/model/store';

const AddComment = () => {
  const { showAddCommentDialog, setShowAddCommentDialog } = useCommentStore();
  const { selectedPost } = useSelectedPostStore();
  const { newComment, setNewComment, resetNewComment } = useCommentStore();
  const { createComments } = useComments();
  const handelAddComment = async () => {
    // ✅ 검증 추가
    if (!selectedPost?.id) {
      console.error('선택된 포스트가 없습니다');
      return;
    }

    if (!newComment.body.trim()) {
      console.error('댓글 내용을 입력해주세요');
      return;
    }

    try {
      // ✅ 올바른 데이터로 mutation 실행
      await createComments.mutateAsync({
        body: newComment.body.trim(), // ✅ 댓글 내용 (포스트 내용 아님!)
        postId: selectedPost.id,
        userId: 1, // ✅ 현재 사용자 ID (selectedPost.userId 아님!)
      });
      
      setShowAddCommentDialog(false);
      resetNewComment();
    } catch (error) {
      console.error('댓글 추가 실패:', error);
    }
  };
  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 댓글 추가</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Input
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) =>
              setNewComment({ ...newComment, body: e.target.value })
            }
          />
          <Button 
            onClick={handelAddComment}
            disabled={createComments.isPending || !newComment.body.trim()}
          >
            {createComments.isPending ? '추가 중...' : '댓글 추가'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default AddComment;
