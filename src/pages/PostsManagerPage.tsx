import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../shared/ui';
import { PostsTable } from '../widgets/postsTable/ui/PostsTable';
import { PostsFilter } from '../widgets/postsFilter/ui/PostsFilter';
import { PostsPagination } from '../widgets/postsPagination/ui/PostsPagination';
import { AddPostDialog } from '../features/posts/add-post/ui/AddPostDialog';
import { EditPostDialog } from '../features/posts/edit-post/ui/EditPostDialog';
import { AddCommentDialog } from '../features/comment/add-comment/ui/AddCommentDialog';
import { EditCommentDialog } from '../features/comment/update-comment/ui/EditCommentDialog';
import { CommentsList } from '../widgets/commentsList/ui/CommentsList';
import { UserModal } from '../features/user/view-user/ui/UserModal';
import { PostDetailDialog } from '../features/posts/view-post/ui/PostDetailDialog';
import { deletePost as deletePostAPI } from '../features/posts/delete-post/api/api';
import { fetchPostComments } from '../features/posts/view-post/api/api';

import { usePostsStore } from '../entities/post/model/store';
import { useTagsStore } from '../entities/tags/model/store';
import { useCommentStore } from '../entities/comment/model/store';
import { highlightText } from '../shared/utils/text';
import PostsHeader from '../widgets/postsHeader/ui/PostsHeader';
import { useDialogStore } from '../shared/store/dialog';
import { DIALOG_KEYS } from '../shared/constant/dialog';
import { useViewUser } from '../features/user/view-user/model/hooks';
import { usePostsUrlParams } from '../features/posts/list-posts/model/hooks';

const PostsManager = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const {
    posts,
    total,
    loading,
    setPosts,
    setTotal,
    fetchPosts: fetchPostsFromStore,
    setSelectedPost,
  } = usePostsStore();
  const { tags, selectedTag, setSelectedTag, fetchTags: fetchTagsFromStore } = useTagsStore();
  const {
    comments,
    newComment,
    setCommentsForPost,
    setSelectedComment,
    setNewComment,
    updateCommentInPost,
    removeCommentFromPost,
  } = useCommentStore();

  const {
    skip,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    setSkip,
    setLimit,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    updatePostsURL,
  } = usePostsUrlParams();

  const { openUserModal } = useViewUser();

  const { openDialog } = useDialogStore();

  const fetchPosts = () => {
    fetchPostsFromStore(limit, skip.toString());
  };
  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts();
      return;
    }
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`);
      const data = await response.json();
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('게시물 검색 오류:', error);
    }
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === 'all') {
      fetchPosts();
      return;
    }
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch('/api/users?limit=0&select=username,image'),
      ]);
      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();

      const postsWithUsers = postsData.posts.map((post: any) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error('태그별 게시물 가져오기 오류:', error);
    }
  };

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await deletePostAPI(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const commentsData = await fetchPostComments(postId);
      setCommentsForPost(postId, commentsData);
    } catch (error) {
      console.error('댓글 가져오기 오류:', error);
    }
  };

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });
      removeCommentFromPost(postId, id);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id);
      if (!currentComment) return;

      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: currentComment.likes + 1 }),
      });
      const data = await response.json();
      updateCommentInPost(postId, id, { ...data, likes: currentComment.likes + 1 });
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  // 게시물 상세 보기
  const openPostDetail = (post: any) => {
    setSelectedPost(post);
    fetchComments(post.id);
    openDialog(DIALOG_KEYS.POST_DETAIL);
  };

  useEffect(() => {
    fetchTagsFromStore();
    // URL에서 selectedTag 초기화
    const tagFromURL = queryParams.get('tag') || '';
    if (tagFromURL !== selectedTag) {
      setSelectedTag(tagFromURL);
    }
  }, []);

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    updatePostsURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || 'asc');
    const tagFromURL = params.get('tag') || '';
    setSelectedTag(tagFromURL);
  }, [location.search]);

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <CommentsList
      postId={postId}
      comments={comments[postId] || []}
      searchQuery={searchQuery}
      highlightText={highlightText}
      onAddComment={(postId) => {
        setNewComment({ ...newComment, postId });
        openDialog(DIALOG_KEYS.ADD_COMMENT);
      }}
      onEditComment={(comment) => {
        setSelectedComment(comment);
        openDialog(DIALOG_KEYS.EDIT_COMMENT);
      }}
      onDeleteComment={deleteComment}
      onLikeComment={likeComment}
    />
  );

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <PostsHeader />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <PostsFilter
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            sortBy={sortBy}
            sortOrder={sortOrder}
            tags={tags}
            onSearchChange={setSearchQuery}
            onSearchSubmit={searchPosts}
            onTagChange={(value) => {
              setSelectedTag(value);
              fetchPostsByTag(value);
              updatePostsURL({ tag: value });
            }}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              highlightText={highlightText}
              onTagClick={(tag) => {
                setSelectedTag(tag);
                updatePostsURL({ tag });
              }}
              onUserClick={openUserModal}
              onPostDetail={openPostDetail}
              onEditPost={(post) => {
                setSelectedPost(post);
                openDialog(DIALOG_KEYS.EDIT_POST);
              }}
              onDeletePost={deletePost}
            />
          )}

          {/* 페이지네이션 */}
          <PostsPagination
            skip={skip}
            limit={limit}
            total={total}
            onSkipChange={setSkip}
            onLimitChange={setLimit}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog searchQuery={searchQuery} />

      {/* 사용자 모달 */}
      <UserModal />
    </Card>
  );
};

export default PostsManager;
