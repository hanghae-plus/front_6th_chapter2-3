import { Dispatch, SetStateAction } from "react"

import { useDeletePost } from "@/entities/post/hook/usePost"
import { changePostSearchParams } from "@/entities/post/lib/postSearchUtils"
import { PostSearchParams, PostWithUser, User } from "@/entities/post/model"
import { PostTable } from "@/entities/post/ui"
import { EditDialogs } from "@/features/post-dialogs/ui"
import { UserViewDialogs } from "@/features/user-dialogs/ui/UserViewDialogs"
import { useDialog } from "@/shared/hook/useDialog"
import { PostViewDialog } from "@/widgets/post-detail/ui"

interface PostsTableProps {
  posts: PostWithUser[]
  searchCondition: PostSearchParams
  setSearchCondition: Dispatch<SetStateAction<PostSearchParams>>
  setSearchInput: Dispatch<SetStateAction<string>>
}

export const PostsTable = ({ posts, searchCondition, setSearchCondition, setSearchInput }: PostsTableProps) => {
  const { mutate: deletePost } = useDeletePost(changePostSearchParams(searchCondition))
  // 게시물 삭제
  const handleDeletePost = (id: number) => {
    deletePost(id)
  }

  const { open: openEditDialog, component: editDialog } = useDialog("post-edit")
  // 게시물 수정
  const handleEditPost = (post: PostWithUser) => {
    openEditDialog(<EditDialogs post={post} searchCondition={searchCondition} />)
  }

  // 태그 변경
  const handleTagChange = (value: string) => {
    const tagValue = value === "all" ? "all" : value
    setSearchCondition((prev) => ({
      ...prev,
      tag: tagValue,
      skip: 0,
      // 태그 선택 시 검색어와 정렬 초기화
      search: tagValue !== "all" ? "" : prev.search,
      sortBy: tagValue !== "all" ? "none" : prev.sortBy,
      order: tagValue !== "all" ? "asc" : prev.order,
    }))
    // 태그 변경 시 검색 입력도 초기화
    if (tagValue !== "all") {
      setSearchInput("")
    }
  }
  const { open: openPostDetailDialog, component: viewDialog } = useDialog("post-view")
  // 게시물 상세 보기
  const handlePostDetail = (post: PostWithUser) => {
    openPostDetailDialog(<PostViewDialog post={post} searchTerm={searchCondition.search || ""} />)
  }

  const { open: openUserInfoDialog, component: userInfoDialog } = useDialog("user-info")
  // 사용자 정보 보기
  const handleUserInfo = (user: User) => {
    openUserInfoDialog(<UserViewDialogs user={user} />)
  }

  return (
    <>
      <PostTable
        onDeletePost={handleDeletePost}
        onEditPost={handleEditPost}
        onPostDetail={handlePostDetail}
        onTagClick={handleTagChange}
        onUserClick={handleUserInfo}
        posts={posts}
        searchCondition={searchCondition}
      />
      {editDialog}
      {viewDialog}
      {userInfoDialog}
    </>
  )
}
