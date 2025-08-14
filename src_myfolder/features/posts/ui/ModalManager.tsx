import React from "react"
import { AddPostModal } from "./modals/AddPostModal"
import { UpdatePostModal } from "./modals/UpdatePostModal"
import { DetailPostModal } from "./modals/DetailPostModal"
import { AddCommentModal } from "../../comment/ui/modals/AddCommentModal"
import { UpdateCommentModal } from "../../comment/ui/modals/UpdateCommentModal"
import { DetailUserModal } from "../../user/ui/modals/DetailUserModal"
import { useAddPost, useUpdatePost, useDetailPost, useDeletePost } from "../hooks"
import { useAddComment, useUpdateComment, useDeleteComment, useLikeComment } from "../../comment/hooks"
import { useOpenUser } from "../../user/hooks/useOpenUser"

export const ModalManager: React.FC = () => {
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
    <>
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

      {/* 게시물 상세 대화상자 */}
      <DetailPostModal
        state={{
          isOpen: detailPost.modal.isOpen,
          selectedPost: detailPost.state.selectedPost!,
          searchMode: { param: "" }, // 실제 검색 쿼리로 교체 필요
          comments: [], // 실제 댓글 데이터로 교체 필요
        }}
        actions={{
          onOpenChange: (open) => (open ? detailPost.modal.open() : detailPost.modal.close()),
          onAddComment: (postId) => addComment.modal.open(),
          onLikeComment: (params) => likeComment.action.like(params),
          onUpdateComment: (comment) => updateComment.action.edit(comment),
          onDeleteComment: (params) => deleteComment.action.delete(params),
        }}
      />

      {/* 댓글 추가 대화상자 */}
      <AddCommentModal
        state={{
          isOpen: addComment.modal.isOpen,
          postId: addComment.state.postId,
          body: addComment.state.body,
        }}
        actions={{
          onOpenChange: (open) => (open ? addComment.modal.open() : addComment.modal.close()),
          change: (key, value) => addComment.actions.change(key, value),
          add: (comment) => addComment.actions.add(comment),
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
          change: (key, value) => updateComment.action.change(key, value),
          update: (comment) => updateComment.action.update(comment),
        }}
      />

      {/* 사용자 상세 대화상자 */}
      <DetailUserModal
        state={{
          isOpen: openUser.modal.isOpen,
          selectedUser: openUser.state.selectedUser!,
        }}
        actions={{
          onOpenChange: (open) => (open ? openUser.modal.open() : openUser.modal.close()),
        }}
      />
    </>
  )
}
