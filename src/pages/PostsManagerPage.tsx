import { Card, CardContent } from "../shared/ui"

import { PostsTable } from "../widgets/posts-table/ui/PostsTable"
import { useFetchPostsByMode } from "../features/posts/fetch-posts-by-mode/hooks/useFetchPostsByMode.ts"
import { useSearchMode } from "../features/posts/fetch-posts-by-mode/hooks/useSearchMode.ts"
import { useTagMode } from "../features/posts/fetch-posts-by-mode/hooks/useTagMode.ts.ts"
import { useTagsQuery } from "../entities/post/hook.ts"
import { usePageNavigateMode } from "../features/posts/fetch-posts-by-mode/hooks/usePageNavigateMode.ts"
import { useAddPost } from "../features/posts/hooks/useAddPost.ts"
import { useUpdatePost } from "../features/posts/hooks/useUpdatePost.ts"
import { useDetailPost } from "../features/posts/hooks/useDetailPost.ts"
import { useDeletePost } from "../features/posts/hooks/useDeletePost.ts"
import { useAddComment } from "../features/comment/hooks/useAddComment.ts"
import { useUpdateComment } from "../features/comment/hooks/useUpdateComment.ts"
import { useDeleteComment } from "../features/comment/hooks/useDeleteComment.ts"
import { useLikeComment } from "../features/comment/hooks/useLikeComment.ts"
import { useOpenUser } from "../features/user/hooks/useOpenUser.ts"
import { useLimitMode } from "../features/posts/fetch-posts-by-mode/hooks/useLimitMode.ts"
import AddPostModal from "../features/posts/ui/modals/AddPostModal.tsx"
import UpdatePostModal from "../features/posts/ui/modals/UpdatePostModal.tsx"
import AddCommentModal from "../features/comment/ui/modals/AddCommentModal.tsx"
import UpdateCommentModal from "../features/comment/ui/modals/UpdateCommentModal.tsx"
import DetailPostModal from "../features/posts/ui/modals/DetailPostModal.tsx"
import DetailUserModal from "../features/user/ui/modals/DetailUserModal.tsx"
import PaginationBar from "../widgets/pagination/PaginationBar.tsx"
import TableLoading from "../features/posts/ui/loading/TableLoading.tsx"
import SortControls from "../features/posts/ui/selects/SortControls.tsx"
import TagSelect from "../features/posts/ui/selects/TagSelect.tsx"
import SearchInput from "../features/posts/ui/search/SearchInput.tsx"
import PostManagerHeader from "../widgets/post-manager-header/ui/PostManagerHeader.tsx"

const PostsManager = () => {
  const posts = useFetchPostsByMode()
  const searchMode = useSearchMode()
  const tagMode = useTagMode()
  const pageNavigateMode = usePageNavigateMode()
  const limitMode = useLimitMode()
  const tags = useTagsQuery()

  const addPost = useAddPost()
  const updatePost = useUpdatePost()
  const detailPost = useDetailPost()
  const deletePost = useDeletePost()

  const addComment = useAddComment()
  const updateComment = useUpdateComment()
  const deleteComment = useDeleteComment()
  const likeComment = useLikeComment()

  const openUser = useOpenUser()

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostManagerHeader openAddPostModal={() => addPost.modal.open()} />
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <SearchInput searchMode={searchMode} />
            <TagSelect tagMode={tagMode} tags={tags.data || []} />
            <SortControls />
          </div>

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
          <PaginationBar limitMode={limitMode} pageNavigateMode={pageNavigateMode} />
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
