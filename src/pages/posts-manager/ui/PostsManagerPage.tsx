/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useShallow } from "zustand/shallow"

import { Post, PostTag } from "@/entities/post/model"
import { usePostParamsStore } from "@/features/get-post/model"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Button } from "@/shared/ui/Button"
import { Card } from "@/shared/ui/Card"
import { CommentAddDialog, CommentUpdateDialog } from "@/widgets/comment-dialog/ui"
import { PostAddDialog, PostDetailDialog, PostUpdateDialog } from "@/widgets/post-dialog/ui"
import { PostsContent } from "@/widgets/posts-content/ui"
import { UserInfoDialog } from "@/widgets/user-dialog/ui"

export function PostsManagerPage() {
  const { openDialog } = useDialogStore((state) => state.actions)
  const { actions, limit, search, skip, sortBy, sortOrder, tag } = usePostParamsStore(useShallow((state) => state))
  const { initializeFromURL } = actions

  // 데이터 상태
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<PostTag[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

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
  const fetchPostsByTag = async (tag: string) => {
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

  useEffect(() => {
    initializeFromURL()
    fetchTags()

    // 게시물 새로고침 이벤트 리스너 등록
    const handleRefreshPosts = () => {
      fetchPosts()
    }

    window.addEventListener("refreshPosts", handleRefreshPosts)

    return () => {
      window.removeEventListener("refreshPosts", handleRefreshPosts)
    }
  }, [])

  useEffect(() => {
    if (tag) {
      fetchPostsByTag(tag)
    } else {
      fetchPosts()
    }
  }, [skip, limit, sortBy, sortOrder, tag])

  return (
    <>
      {/* contents */}
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
          <PostsContent
            posts={posts}
            total={total}
            loading={loading}
            tags={tags}
            searchPosts={searchPosts}
            fetchPostsByTag={fetchPostsByTag}
            deletePost={deletePost}
          />
        </Card.Content>
      </Card>

      {/* dialogs */}
      <CommentAddDialog />
      <CommentUpdateDialog />
      <PostAddDialog />
      <PostDetailDialog />
      <PostUpdateDialog />
      <UserInfoDialog />
    </>
  )
}
