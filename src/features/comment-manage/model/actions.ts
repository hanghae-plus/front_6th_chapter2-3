import { FormEvent } from "react"
import { useAtom } from "jotai"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { commentsKey } from "../../../shared/api/queryKeys"
import {
  fetchCommentsByPostId,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
} from "../../../entities/comment/api"
import {
  selectedPostAtom,
  editableCommentAtom,
  newCommentDataAtom,
  showAddCommentDialogAtom,
  showEditCommentDialogAtom,
} from "./atoms"
import type { Comment } from "../../../entities/comment/model"

export const useCommentManage = () => {
  const [selectedPostId, setSelectedPostId] = useAtom(selectedPostAtom)
  const [editableComment, setEditableComment] = useAtom(editableCommentAtom)
  const [newCommentData, setNewCommentData] = useAtom(newCommentDataAtom)
  const [showAddDialog, setShowAddDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditCommentDialogAtom)

  const queryClient = useQueryClient()

  const { data: comments = [] } = useQuery({
    queryKey: commentsKey.byPost(selectedPostId),
    queryFn: () => fetchCommentsByPostId(selectedPostId!),
    enabled: !!selectedPostId,
    select: (data) => data.comments,
    // 새로고침/포커스 전환 등으로 원본으로 되돌아가지 않도록
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  const addCommentMutation = useMutation({
    mutationFn: (variables: { body: string; postId: number; userId: number }) =>
      variables.postId < 0 ? Promise.resolve({} as any) : addComment(variables),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: commentsKey.byPost(selectedPostId) })
      const previous = queryClient.getQueryData(commentsKey.byPost(selectedPostId))
      queryClient.setQueryData(commentsKey.byPost(selectedPostId), (old: any) => {
        const list = (old?.comments ?? []) as Comment[]
        const temp = {
          id: Math.floor(Math.random() * -100000),
          body: variables.body,
          postId: variables.postId,
          likes: 0,
          user: { id: 1, username: "you" },
        } as Comment
        return { ...old, comments: [temp, ...list] }
      })
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(commentsKey.byPost(selectedPostId), ctx.previous)
    },
    // invalidate 하지 않음: 화면 상태 유지
  })

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, body }: { commentId: number; body: string }) =>
      commentId < 0 ? Promise.resolve({} as any) : updateComment(commentId, body),
    onMutate: async ({ commentId, body }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey.byPost(selectedPostId) })
      const previous = queryClient.getQueryData(commentsKey.byPost(selectedPostId))
      queryClient.setQueryData(commentsKey.byPost(selectedPostId), (old: any) => {
        return {
          ...old,
          comments: (old?.comments ?? []).map((c: Comment) => (c.id === commentId ? { ...c, body } : c)),
        }
      })
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(commentsKey.byPost(selectedPostId), ctx.previous)
    },
    // invalidate 하지 않음: 화면 상태 유지
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => (commentId < 0 ? Promise.resolve({} as any) : deleteComment(commentId)),
    onMutate: async (commentId: number) => {
      await queryClient.cancelQueries({ queryKey: commentsKey.byPost(selectedPostId) })
      const previous = queryClient.getQueryData(commentsKey.byPost(selectedPostId))
      queryClient.setQueryData(commentsKey.byPost(selectedPostId), (old: any) => {
        return { ...old, comments: (old?.comments ?? []).filter((c: Comment) => c.id !== commentId) }
      })
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(commentsKey.byPost(selectedPostId), ctx.previous)
    },
    // invalidate 하지 않음: 화면 상태 유지
  })

  const likeCommentMutation = useMutation({
    mutationFn: ({ commentId, currentLikes }: { commentId: number; currentLikes: number }) =>
      commentId < 0 ? Promise.resolve({} as any) : likeComment(commentId, currentLikes),
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey.byPost(selectedPostId) })
      const previous = queryClient.getQueryData(commentsKey.byPost(selectedPostId))
      queryClient.setQueryData(commentsKey.byPost(selectedPostId), (old: any) => {
        return {
          ...old,
          comments: (old?.comments ?? []).map((c: Comment) =>
            c.id === commentId ? { ...c, likes: (c.likes ?? 0) + 1 } : c,
          ),
        }
      })
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(commentsKey.byPost(selectedPostId), ctx.previous)
    },
    // invalidate 하지 않음: 화면 상태 유지
  })

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault()
    if (!newCommentData.postId) return
    try {
      await addCommentMutation.mutateAsync(newCommentData)
      setShowAddDialog(false)
      setNewCommentData({ body: "", postId: 0, userId: 1 })
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
  }

  const handleUpdateComment = async (e: FormEvent) => {
    e.preventDefault()
    if (!editableComment?.id || !editableComment.body) return
    try {
      await updateCommentMutation.mutateAsync({
        commentId: editableComment.id,
        body: editableComment.body,
      })
      setShowEditDialog(false)
    } catch (error) {
      console.error("Failed to update comment:", error)
    }
  }

  const openAddDialog = (postId: number) => {
    setNewCommentData({ body: "", postId, userId: 1 })
    setShowAddDialog(true)
  }

  const openEditDialog = (comment: Comment) => {
    setEditableComment(comment)
    setShowEditDialog(true)
  }

  const openPostComments = (postId: number) => {
    setSelectedPostId(postId)
    // 댓글 목록을 보여주는 다이얼로그나 모달을 여는 로직을 여기에 추가할 수 있음
  }

  return {
    comments,
    selectedPostId,
    newCommentData,
    setNewCommentData,
    editableComment,
    setEditableComment,
    showAddDialog,
    showEditDialog,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment: (commentId: number) => deleteCommentMutation.mutate(commentId),
    handleLikeComment: (commentId: number, currentLikes: number) =>
      likeCommentMutation.mutate({ commentId, currentLikes }),
    openAddDialog,
    openEditDialog,
    openPostComments,
    closeAddDialog: () => setShowAddDialog(false),
    closeEditDialog: () => setShowEditDialog(false),
  }
}
