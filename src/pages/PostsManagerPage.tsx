import { useState, useCallback, FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components";
import { usePosts } from "../hooks/usePosts";
import { useTags } from "../hooks/useTags";
import { usePostMutations } from "../hooks/usePostMutations";
import { fetchUserDetails } from "../api/users";
import type { Post, UserDetails, UserSummary, Comment } from "../types";

import { PostFilters } from "../components/posts/PostFilters";
import { PostsTable } from "../components/posts/PostsTable";
import { PaginationControls } from "../components/posts/PaginationControls";
import { PostFormDialog, PostDetailDialog, CommentFormDialog, UserDialog } from "../components/posts/PostDialogs";
import { useComments } from "@/hooks/useComments";

const PostsManagerPage = () => {
  const {
    posts,
    total,
    postsLoading,
    postsError,
    skip,
    limit,
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    setSkip,
    setLimit,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
    handleSearch,
  } = usePosts();

  const { data: tags = [] } = useTags();
  const { addPost, updatePost, deletePost } = usePostMutations();

  const [showAddPostDialog, setShowAddPostDialog] = useState(false);
  const [showEditPostDialog, setShowEditPostDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editablePost, setEditablePost] = useState<Partial<Post> & { userId?: number } | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [editableComment, setEditableComment] = useState<Partial<Comment> | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

  const [newPostData, setNewPostData] = useState({ title: "", body: "", userId: 1 });
  const [newCommentData, setNewCommentData] = useState({ body: "", postId: 0, userId: 1 });

  const { comments, addComment, updateComment, deleteComment, likeComment } = useComments(selectedPost?.id || null);

  const handleAddPost = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addPost(newPostData);
      setShowAddPostDialog(false);
      setNewPostData({ title: "", body: "", userId: 1 });
    } catch (error) {
      console.error("Failed to add post:", error);
    }
  };

  const handleUpdatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!editablePost?.id) return;
    try {
      await updatePost({ postId: editablePost.id, postData: { title: editablePost.title, body: editablePost.body } });
      setShowEditPostDialog(false);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        await deletePost(postId);
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentData.postId) return;
    try {
      await addComment(newCommentData);
      setShowAddCommentDialog(false);
      setNewCommentData({ body: "", postId: 0, userId: 1 });
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleUpdateComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!editableComment?.id || !editableComment.body) return;
    try {
      await updateComment({ commentId: editableComment.id, body: editableComment.body });
      setShowEditCommentDialog(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const openUserModal = async (user: UserSummary) => {
    if (!user) return;
    try {
      const userData = await fetchUserDetails(user.id);
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const highlightText = useCallback(
    (text: string) => {
      if (!text || !searchQuery.trim()) return <span>{text}</span>;
      const regex = new RegExp(`(${searchQuery})`, "gi");
      const parts = text.split(regex);
      return (
        <span>
          {parts.map((part, i) =>
            regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
          )}
        </span>
      );
    },
    [searchQuery]
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddPostDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            tags={tags}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {postsLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : postsError ? (
            <div className="text-red-500 text-center p-4">Error: {postsError.message}</div>
          ) : (
            <PostsTable
              posts={posts}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              highlightText={highlightText}
              openPostDetail={setSelectedPost}
              openUserModal={openUserModal}
              onEdit={(post) => {
                setEditablePost(post);
                setShowEditPostDialog(true);
              }}
              onDelete={handleDeletePost}
            />
          )}

          <PaginationControls
            skip={skip}
            limit={limit}
            total={total}
            setSkip={setSkip}
            setLimit={setLimit}
          />
        </div>
      </CardContent>

      <PostFormDialog
        open={showAddPostDialog}
        onOpenChange={setShowAddPostDialog}
        onSubmit={handleAddPost}
        post={newPostData}
        setPost={setNewPostData}
        isEdit={false}
      />

      {editablePost && (
        <PostFormDialog
          open={showEditPostDialog}
          onOpenChange={setShowEditPostDialog}
          onSubmit={handleUpdatePost}
          post={editablePost}
          setPost={setEditablePost}
          isEdit={true}
        />
      )}

      <PostDetailDialog
        open={!!selectedPost}
        onOpenChange={() => setSelectedPost(null)}
        post={selectedPost}
        comments={comments}
        highlightText={highlightText}
        onCommentAdd={() => {
          if (selectedPost) {
            setNewCommentData({ body: "", postId: selectedPost.id, userId: 1 });
            setShowAddCommentDialog(true);
          }
        }}
        onCommentEdit={(comment) => {
          setEditableComment(comment);
          setShowEditCommentDialog(true);
        }}
        onCommentDelete={(_, commentId) => deleteComment(commentId)}
        onCommentLike={(_, commentId) => likeComment(commentId)}
      />

      <CommentFormDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        onSubmit={handleAddComment}
        commentBody={newCommentData.body}
        setCommentBody={(body) => setNewCommentData({ ...newCommentData, body })}
        isEdit={false}
      />

      {editableComment && (
        <CommentFormDialog
          open={showEditCommentDialog}
          onOpenChange={setShowEditCommentDialog}
          onSubmit={handleUpdateComment}
          commentBody={editableComment.body || ""}
          setCommentBody={(body) => setEditableComment({ ...editableComment, body })}
          isEdit={true}
        />
      )}

      <UserDialog
        open={showUserModal}
        onOpenChange={setShowUserModal}
        user={selectedUser}
      />
    </Card>
  );
};

export default PostsManagerPage;
