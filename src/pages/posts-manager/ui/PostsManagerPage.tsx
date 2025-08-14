/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useShallow } from "zustand/shallow"

import { usePostParamsStore } from "@/features/get-post/model"
import { PostSearchInput, PostSortBySelect, PostSortOrderSelect, PostTagFilterSelect } from "@/features/get-post/ui"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Button } from "@/shared/ui/Button"
import { Card } from "@/shared/ui/Card"
import { CommentAddDialog, CommentUpdateDialog } from "@/widgets/comment-dialog/ui"
import { PostAddDialog, PostDetailDialog, PostUpdateDialog } from "@/widgets/post-dialog/ui"
import { PostPagination } from "@/widgets/post-pagination/ui"
import { PostTable } from "@/widgets/post-table/ui"
import { UserInfoDialog } from "@/widgets/user-dialog/ui"

export function PostsManagerPage() {
  const { openDialog, closeDialog } = useDialogStore((state) => state.actions)
  const { actions, limit, search, skip, sortBy, sortOrder, tag } = usePostParamsStore(useShallow((state) => state))
  const { updateParam, initializeFromURL } = actions

  // Dialog 관련 상태
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [selectedComment, setSelectedComment] = useState<any>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newPost, setNewPost] = useState<any>({ title: "", body: "", userId: 1 })
  const [newComment, setNewComment] = useState<any>({ body: "", postId: null, userId: 1 })

  // 데이터 상태
  const [posts, setPosts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<any[]>([])
  const [comments, setComments] = useState<any>({})

  // 게시물 가져오기
  const fetchPosts = () => {
    setLoading(true)
    let postsData: any
    let usersData: any

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        postsData = data
        return fetch("/api/users?limit=0&select=username,image")
      })
      .then((response) => response.json())
      .then((users) => {
        usersData = users.users
        const postsWithUsers = postsData.posts.map((post: any) => ({
          ...post,
          author: usersData.find((user: any) => user.id === post.userId),
        }))
        setPosts(postsWithUsers)
        setTotal(postsData.total)
      })
      .catch((error) => {
        console.error("게시물 가져오기 오류:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!search) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/search?q=${search}`)
      const data = await response.json()
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: any) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch("/api/users?limit=0&select=username,image"),
      ])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()

      const postsWithUsers = postsData.posts.map((post: any) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 게시물 추가
  const addPost = async () => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      const data = await response.json()
      setPosts([data, ...posts])
      closeDialog()
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePost = async () => {
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      })
      const data = await response.json()
      setPosts(posts.map((post: any) => (post.id === data.id ? data : post)))
      closeDialog()
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: any) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      setPosts(posts.filter((post: any) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: any) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data = await response.json()
      setComments((prev: any) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
    try {
      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
      const data = await response.json()
      setComments((prev: any) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      openDialog(DialogType.POST_DETAIL)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data = await response.json()
      setComments((prev: any) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment: any) => (comment.id === data.id ? data : comment)),
      }))
      openDialog(DialogType.POST_DETAIL)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id: any, postId: any) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      setComments((prev: any) => ({
        ...prev,
        [postId]: prev[postId].filter((comment: any) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: any, postId: any) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: comments[postId].find((c: any) => c.id === id).likes + 1 }),
      })
      const data = await response.json()
      setComments((prev: any) => ({
        ...prev,
        [postId]: prev[postId].map((comment: any) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: any) => {
    setSelectedPost(post)
    fetchComments(post.id)
    openDialog(DialogType.POST_DETAIL)
  }

  // 사용자 모달 열기
  const handleOpenUserModal = async (user: any) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      openDialog(DialogType.USER_MODAL)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    initializeFromURL()
    fetchTags()
  }, [])

  useEffect(() => {
    if (tag) {
      fetchPostsByTag(tag)
    } else {
      fetchPosts()
    }
  }, [skip, limit, sortBy, sortOrder, tag])

  return (
    <Card className="mx-auto w-full max-w-6xl">
      <Card.Header>
        <Card.Title className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => openDialog(DialogType.ADD_POST)}>
            <Plus className="mr-2 h-4 w-4" />
            게시물 추가
          </Button>
        </Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <PostSearchInput onSearch={searchPosts} />
            <PostTagFilterSelect tags={tags} onTagChange={fetchPostsByTag} />
            <PostSortBySelect />
            <PostSortOrderSelect />
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              onTagClick={(tagValue: string) => updateParam("tag", tagValue)}
              onUserClick={handleOpenUserModal}
              onPostDetailClick={openPostDetail}
              onPostEditClick={(post: any) => {
                setSelectedPost(post)
                openDialog(DialogType.EDIT_POST)
              }}
              onPostDeleteClick={deletePost}
            />
          )}

          <PostPagination total={total} />
        </div>
      </Card.Content>

      {/* 댓글 추가 다이얼로그 */}
      <CommentAddDialog addComment={addComment} newComment={newComment} setNewComment={setNewComment} />

      {/* 댓글 수정 다이얼로그 */}
      <CommentUpdateDialog
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        updateComment={updateComment}
      />

      {/* 게시물 추가 다이얼로그 */}
      <PostAddDialog addPost={addPost} newPost={newPost} setNewPost={setNewPost} />

      {/* 게시물 상세 보기 다이얼로그 */}
      <PostDetailDialog
        selectedPost={selectedPost}
        comments={comments}
        onAddComment={(postId: any) => {
          setNewComment((prev: any) => ({ ...prev, postId }))
          openDialog(DialogType.ADD_COMMENT)
        }}
        onEditComment={(comment: any) => {
          setSelectedComment(comment)
          openDialog(DialogType.EDIT_COMMENT)
        }}
        onDeleteComment={deleteComment}
        onLikeComment={likeComment}
      />

      {/* 게시물 수정 다이얼로그 */}
      <PostUpdateDialog selectedPost={selectedPost} setSelectedPost={setSelectedPost} updatePost={updatePost} />

      {/* 사용자 정보 보기 다이얼로그 */}
      <UserInfoDialog selectedUser={selectedUser} />
    </Card>
  )
}
