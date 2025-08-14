import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../shared/ui";
import { getUser } from "../entities/user/api";
import { UserModal } from "../entities/user/ui/UserModal";
import { Pagination } from "../shared/ui/Pagination";
import { PostAddDialog } from "../features/post/ui/PostAddDialog";
import { PostUpdateDialog } from "../features/post/ui/PostUpdateDialog";
import { CommentAddDialog } from "../features/comment/ui/CommentAddDialog";
import { Comment as CommentType } from "../entities/comment/types";
import { CommentUpdateDialog } from "../features/comment/ui/CommentUpdateDialog";
import { PostDetailDialog } from "../features/post/ui/PostDetailDialog";
import { Comments } from "../features/comment/ui/Comments";
import { useComments } from "../features/comment/models/useComment";
import { usePosts } from "../features/post/models/usePosts";
import { Post } from "../entities/post/types";
import { PostTable } from "../entities/post/ui/PostTable";
import { useTags } from "../entities/tag/models";
import { PostFiltersBar } from "../widgets/post-filters/ui/PostFiltersBar";
import { usePostQuery } from "../features/post/models/usePostQuery";
import { User } from "../entities/user/types";

const PostsManager = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 });
  const [newComment, setNewComment] = useState<Partial<CommentType>>({ body: "", postId: null, userId: 1 });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const { postQuery, setSkip, setLimit, setSearchQuery, setSortBy, setSortOrder, setSelectedTag, updateURL } =
    usePostQuery();
  const { skip, limit, searchQuery, sortBy, sortOrder, selectedTag } = postQuery;

  const { comments, fetchComments, handleAddComment, handleLikeComment, handleDeleteComment, handleUpdateComment } =
    useComments({
      newComment,
      setNewComment,
      selectedComment,
      setShowAddCommentDialog,
      setShowEditCommentDialog,
    });

  const { posts, total, loading, searchPosts, fetchPostsByTag, handleAddPost, handleUpdatePost, handleDeletePost } =
    usePosts({ ...postQuery, newPost, updateURL, setNewPost, selectedPost, setShowAddDialog, setShowEditDialog });

  const { tags, fetchTags } = useTags();

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
    try {
      const userData = await getUser({ id: user.id });
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostFiltersBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPosts={searchPosts}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            fetchPostsByTag={fetchPostsByTag}
            updateURL={updateURL}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            tags={tags}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              openUserModal={openUserModal}
              openPostDetail={openPostDetail}
              handleDeletePost={handleDeletePost}
              setSelectedPost={setSelectedPost}
              setShowEditDialog={setShowEditDialog}
              updateURL={updateURL}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination limit={limit} setLimit={setLimit} skip={skip} setSkip={setSkip} total={total} />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        newPost={newPost}
        setNewPost={setNewPost}
        handleAddPost={handleAddPost}
      />

      {/* 게시물 수정 대화상자 */}
      <PostUpdateDialog
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        handleUpdatePost={handleUpdatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <CommentAddDialog
        showAddCommentDialog={showAddCommentDialog}
        setShowAddCommentDialog={setShowAddCommentDialog}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
      />

      {/* 댓글 수정 대화상자 */}
      <CommentUpdateDialog
        showEditCommentDialog={showEditCommentDialog}
        setShowEditCommentDialog={setShowEditCommentDialog}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        handleUpdateComment={handleUpdateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        showPostDetailDialog={showPostDetailDialog}
        setShowPostDetailDialog={setShowPostDetailDialog}
        selectedPost={selectedPost}
        searchQuery={searchQuery}
        bottom={
          <Comments
            comments={comments[selectedPost?.id ?? 0] ?? []}
            searchQuery={searchQuery}
            handleAddComment={() => {
              setNewComment((prev) => ({ ...prev, postId: selectedPost?.id ?? 0 }));
              setShowAddCommentDialog(true);
            }}
            handleLikeComment={handleLikeComment}
            handleDeleteComment={handleDeleteComment}
            handleEditComment={(comment) => {
              setSelectedComment(comment);
              setShowEditCommentDialog(true);
            }}
          />
        }
      />

      {/* 사용자 모달 */}
      <UserModal showUserModal={showUserModal} setShowUserModal={setShowUserModal} selectedUser={selectedUser} />
    </Card>
  );
};

export default PostsManager;
