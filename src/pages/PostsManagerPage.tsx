import { Card, CardContent } from "../shared/ui"

// 위젯 컴포넌트들
import { PostsTable, PaginationControls, PostFilter, PostManagerHeader } from "../widgets"

// 훅들
import { useFetchPostsByMode, useSearchMode, useTagMode } from "../features/posts/fetch-posts-by-mode/hooks"
import { useAddPost, useUpdatePost, useDetailPost, useDeletePost } from "../features/posts/hooks"
import { useAddComment, useUpdateComment, useDeleteComment, useLikeComment } from "../features/comment/hooks"
import { useOpenUser } from "../features/user/hooks"

// 모달 컴포넌트들
import { AddPostModal, UpdatePostModal, DetailPostModal } from "../features/posts/ui/modals"
import { AddCommentModal, UpdateCommentModal } from "../features/comment/ui/modals"
import { DetailUserModal } from "../features/user/ui/modals"

// 기타 UI 컴포넌트들
import { TableLoading } from "../features/posts/ui/loading"

const PostsManager = () => {
  // 게시물 조회 관련 훅들
  const posts = useFetchPostsByMode()
  const searchMode = useSearchMode()
  const tagMode = useTagMode()

  // 게시물 CUD 관련 훅들
  const addPost = useAddPost()
  const updatePost = useUpdatePost()
  const detailPost = useDetailPost()
  const deletePost = useDeletePost()

  // 댓글 관련 훅들
  const addComment = useAddComment()
  const updateComment = useUpdateComment()
  const deleteComment = useDeleteComment()
  const likeComment = useLikeComment()

  // 사용자 관련 훅
  const openUser = useOpenUser()

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostManagerHeader openAddPostModal={() => addPost.modal.open()} />
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostFilter />

          {/* 게시물 테이블 */}
          {posts.loading ? (
            <TableLoading />
          ) : (
            <PostsTable
              data={{
                rows: posts.posts,
                searchQuery: searchMode.param,
                selectedTag: tagMode.param,
              }}
              handlers={{
                onTagClick: (tag) => {
                  tagMode.update(tag)
                },
                onOpenDetail: (post) => detailPost.actions.detail(post),
                onEdit: (post) => updatePost.action.edit(post),
                onDelete: (id) => deletePost.action.delete(id),
                onAuthorClick: (author) => author && openUser.action.open(author.id),
              }}
            />
          )}
          {/* 페이지네이션 */}
          <PaginationControls />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostModal
        state={{
          isOpen: addPost.modal.isOpen,
          title: addPost.state.newPost.title,
          body: addPost.state.newPost.body,
          userId: addPost.state.newPost.userId,
        }}
        actions={{
          onOpenChange: (open) => (open ? addPost.modal.open() : addPost.modal.close()),
          change: (key, value) => addPost.actions.change(key, value),
          add: (post) => addPost.actions.add(post),
        }}
      />

      {/* 게시물 수정 대화상자 */}
      <UpdatePostModal
        state={{
          isOpen: updatePost.modal.isOpen,
          selectedPost: updatePost.state.selectedPost!,
        }}
        actions={{
          onOpenChange: (open) => (open ? updatePost.modal.open() : updatePost.modal.close()),
          change: (key, value) => updatePost.action.change(key, value),
          update: (post) => updatePost.action.update(post),
        }}
      />

      {/* 댓글 추가 대화상자 */}
      <AddCommentModal
        state={{
          isOpen: addComment.modal.isOpen,
          newComment: addComment.state.newComment,
        }}
        actions={{
          onOpenChange: (open) => (open ? addComment.modal.open() : addComment.modal.close()),
          change: (body) => addComment.action.change(body),
          add: (comment) => addComment.action.add(comment),
        }}
      />

      {/* 댓글 수정 대화상자 */}
      <UpdateCommentModal
        state={{
          isOpen: updateComment.modal.isOpen,
          selectedComment: updateComment.state.selectedComment!,
        }}
        actions={{
          onOpenChange: (open) => (open ? updateComment.modal.open() : updateComment.modal.close()),
          change: (body) => updateComment.action.change(body),
          update: (comment) => updateComment.action.update(comment),
        }}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <DetailPostModal
        state={{
          isOpen: detailPost.modal.isOpen,
          selectedPost: detailPost.state.selectedPost!,
          searchMode: searchMode,
          comments: detailPost.state.comments,
        }}
        actions={{
          onOpenChange: (open) => (open ? detailPost.modal.open() : detailPost.modal.close()),
          onAddComment: (postId) => addComment.action.open(postId),
          onLikeComment: (params) => likeComment.action.like(params),
          onUpdateComment: (comment) => updateComment.action.open(comment),
          onDeleteComment: (params) => deleteComment.action.delete(params),
        }}
      />

      {/* 사용자 모달 */}
      <DetailUserModal
        state={{
          isOpen: openUser.modal.isOpen,
          selectedUser: openUser.state.selectedUser!,
        }}
        actions={{
          onOpenChange: (open) => (open ? openUser.modal.open() : openUser.modal.close()),
        }}
      />
    </Card>
  )
}

export default PostsManager
