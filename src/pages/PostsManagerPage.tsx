import { PostsSearchWidget } from '@widgets/posts-search'
import { PostsTableWidget } from '@widgets/posts-table'
import { PostFormDialogWidget } from '@widgets/post-form-dialog'
import { CommentManagementWidget } from '@widgets/comment-management'
import { UserProfileModalWidget } from '@widgets/user-profile-modal'

const PostsManager = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* 검색 및 필터 위젯 */}
      <PostsSearchWidget />

      {/* 게시물 테이블 위젯 */}
      <PostsTableWidget />

      {/* 모달 위젯들 */}
      <PostFormDialogWidget />
      <CommentManagementWidget />
      <UserProfileModalWidget />
    </div>
  )
}

export default PostsManager
