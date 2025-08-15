import { SearchFilterBar, PostHeader } from '@/widgets'
import { Pagination, Card, CardContent } from '@/shared/ui'
import {
  CommentRenderUI,
  AddCommentDialog,
  UpdateCommentDialog,
} from '@/features/comment/'
import { highlightText } from '@/shared/utils/highlightText'
import {
  useAddPosts,
  useDeletePosts,
  useUpdatePosts,
  PostRenderUi,
  AddPostDialog,
  UpdatePostDialog,
  DetailPostDialog,
} from '@/features/post'

import { OpenUserModalDialog } from '@/features/user'
import { usePostsManager } from '../model/usePostManager'

const PostsManager = () => {
  const pm = usePostsManager()

  // const fetchPostsByTag = async (tag) => {
  //   if (!tag || tag === 'all') {
  //     fetchPosts()
  //     return
  //   }
  //   setLoading(true)
  //   try {
  //     const [postsResponse, usersResponse] = await Promise.all([
  //       fetch(`/api/posts/tag/${tag}`),
  //       fetch('/api/users?limit=0&select=username,image'),
  //     ])
  //     const postsData = await postsResponse.json()
  //     const usersData = await usersResponse.json()

  //     const postsWithUsers = postsData.posts.map((post) => ({
  //       ...post,
  //       author: usersData.users.find((user) => user.id === post.userId),
  //     }))

  //     setPosts(postsWithUsers)
  //     setTotal(postsData.total)
  //   } catch (error) {
  //     console.error('태그별 게시물 가져오기 오류:', error)
  //   }
  //   setLoading(false)
  // }

  // 게시물 추가
  const addPost = useAddPosts(
    pm.posts,
    pm.setPosts,
    pm.setShowAddDialog,
    pm.newPost,
    pm.setNewPost
  )

  // 게시물 업데이트
  const updatePost = useUpdatePosts(
    pm.selectedPost,
    pm.posts,
    pm.setPosts,
    pm.setShowEditDialog
  )

  // 게시물 삭제
  const deletePost = useDeletePosts(pm.posts, pm.setPosts)

  const handleTagChange = (value: string) => {
    pm.setSelectedTag(value)
    pm.fetchPosts(value)
    pm.updateURL()
  }

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <PostHeader onShowAddDialog={pm.setShowAddDialog} />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <SearchFilterBar
            searchQuery={pm.searchQuery}
            selectedTag={pm.selectedTag}
            sortBy={pm.sortBy}
            sortOrder={pm.sortOrder}
            tags={pm.tags}
            onSearchChange={pm.setSearchQuery}
            onTagChange={handleTagChange}
            onSortByChange={pm.setSortBy}
            onSortOrderChange={pm.setSortOrder}
            onSearch={pm.searchPosts}
          />

          {/* 게시물 테이블 */}
          {pm.loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostRenderUi
              posts={pm.posts}
              searchQuery={pm.searchQuery}
              selectedTag={pm.selectedTag}
              setSelectedTag={pm.setSelectedTag}
              updateURL={pm.updateURL}
              openUserModal={pm.openUserModal}
              openPostDetail={pm.openPostDetail}
              setSelectedPost={pm.setSelectedPost}
              setShowEditDialog={pm.setShowEditDialog}
              deletePost={deletePost}
              highlightText={highlightText}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            total={pm.total}
            limit={pm.limit}
            onLimitChange={pm.setLimit}
            skip={pm.skip}
            onSkipChange={pm.setSkip}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog
        showAddDialog={pm.showAddDialog}
        onOpenChange={pm.setShowAddDialog}
        newPost={pm.newPost}
        setNewPost={pm.setNewPost}
        addPost={addPost}
      />

      {/* 게시물 수정 대화상자 */}
      <UpdatePostDialog
        showEditDialog={pm.showEditDialog}
        onOpenChange={pm.setShowEditDialog}
        selectedPost={pm.selectedPost}
        setSelectedPost={pm.setSelectedPost}
        updatePost={updatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        showAddCommentDialog={pm.showAddCommentDialog}
        onOpenChange={pm.setShowAddCommentDialog}
        newComment={pm.newComment}
        setNewComment={pm.setNewComment}
        addComment={pm.addComment}
      />

      {/* 댓글 수정 대화상자 */}
      <UpdateCommentDialog
        showEditCommentDialog={pm.showEditCommentDialog}
        onOpenChange={pm.setShowEditCommentDialog}
        selectedComment={pm.selectedComment}
        setSelectedComment={pm.setSelectedComment}
        updateComment={pm.updateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <DetailPostDialog
        showPostDetailDialog={pm.showPostDetailDialog}
        onOpenChange={pm.setShowPostDetailDialog}
        selectedPost={pm.selectedPost}
        searchQuery={pm.searchQuery}
      >
        <CommentRenderUI
          postId={pm.selectedPost?.id ?? 0} // 또는 postId={selectedPost ? selectedPost.id : 0}
          comments={pm.comments}
          searchQuery={pm.searchQuery}
          setNewComment={pm.setNewComment}
          setShowAddCommentDialog={pm.setShowAddCommentDialog}
          setSelectedComment={pm.setSelectedComment}
          setShowEditCommentDialog={pm.setShowEditCommentDialog}
          likeComment={pm.likeComment}
          deleteComment={pm.deleteComment}
        />
      </DetailPostDialog>

      {/* 사용자 모달 */}
      <OpenUserModalDialog
        showUserModal={pm.showUserModal}
        setShowUserModal={pm.setShowUserModal}
        selectedUser={pm.selectedUser}
      />
    </Card>
  )
}

export default PostsManager
