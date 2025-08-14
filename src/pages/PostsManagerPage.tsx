import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "../shared/ui";
import { DropdownSelect } from "../shared/ui/DropdownSelect";
import { getTags } from "../entities/tag/api";
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
import { usePosts } from "../features/post/models/usePost";
import { Post } from "../entities/post/types";
import { PostTable } from "../entities/post/ui/PostTable";

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // 상태 관리
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"));
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"));
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "");
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 });
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "");
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(null);
  const [newComment, setNewComment] = useState<Partial<CommentType>>({ body: "", postId: null, userId: 1 });
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { comments, fetchComments, handleAddComment, handleLikeComment, handleDeleteComment, handleUpdateComment } =
    useComments({
      newComment,
      setNewComment,
      selectedComment,
      setShowAddCommentDialog,
      setShowEditCommentDialog,
    });

  const {
    posts,
    total,
    loading,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
  } = usePosts({
    limit,
    skip,
    searchQuery,
    newPost,
    setNewPost,
    selectedPost,
    setShowAddDialog,
    setShowEditDialog,
  });

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set("skip", skip.toString());
    if (limit) params.set("limit", limit.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (selectedTag) params.set("tag", selectedTag);
    navigate(`?${params.toString()}`);
  };

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const tagsData = await getTags();
      setTags(tagsData);
    } catch (error) {
      console.error("태그 가져오기 오류:", error);
    }
  };

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (user) => {
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

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get("skip") || "0"));
    setLimit(parseInt(params.get("limit") || "10"));
    setSearchQuery(params.get("search") || "");
    setSortBy(params.get("sortBy") || "");
    setSortOrder(params.get("sortOrder") || "asc");
    setSelectedTag(params.get("tag") || "");
  }, [location.search]);

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
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchPosts()}
                />
              </div>
            </div>

            <DropdownSelect
              value={selectedTag}
              onChange={(value) => {
                setSelectedTag(value);
                fetchPostsByTag(value);
                updateURL();
              }}
              options={[
                { key: "all", label: "모든 태그", value: "all" },
                ...tags.map((tag) => ({ key: tag.url, label: tag.slug, value: tag.slug })),
              ]}
              placeholder="태그 선택"
            />
            <DropdownSelect
              value={sortBy}
              onChange={(value) => {
                setSortBy(value);
              }}
              options={[
                { key: "none", label: "없음", value: "none" },
                { key: "id", label: "ID", value: "id" },
                { key: "title", label: "제목", value: "title" },
                { key: "reactions", label: "반응", value: "reactions" },
              ]}
              placeholder="정렬 기준"
            />
            <DropdownSelect
              value={sortOrder}
              onChange={(value) => {
                setSortOrder(value);
              }}
              options={[
                { key: "asc", label: "오름차순", value: "asc" },
                { key: "desc", label: "내림차순", value: "desc" },
              ]}
              placeholder="정렬 순서"
            />
          </div>

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
        Comments={
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
