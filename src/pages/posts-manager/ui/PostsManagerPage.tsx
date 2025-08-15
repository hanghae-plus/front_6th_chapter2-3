/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useShallow } from "zustand/shallow"

import { Post } from "@/entities/post/model"
import { useDeletePostMutation } from "@/features/delete-post/api"
import { usePostsByTagQuery, usePostsSearchQuery } from "@/features/get-post/api"
import { usePostParamsStore } from "@/features/get-post/model"
import { useUsersQuery } from "@/features/get-user/api"
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
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // 게시물 가져오기
  const fetchPosts = () => {
    const prefixUrl = import.meta.env.PROD ? "https://dummyjson.com" : "/api"
    setLoading(true)
    let postsData: any
    let usersData: any

    fetch(`${prefixUrl}/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        postsData = data
        return fetch(`${prefixUrl}/users?limit=0&select=username,image`)
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

  const { data: searchData, isLoading: isSearchLoading } = usePostsSearchQuery({ query: search })
  const { data: tagData, isLoading: isTagLoading } = usePostsByTagQuery({ tag }, { enabled: !!tag && tag !== "all" })
  const { data: usersData } = useUsersQuery({}, { enabled: !!tag && tag !== "all" })

  useEffect(() => {
    if (search && search.trim() && searchData && !isSearchLoading) {
      setPosts(searchData.posts)
      setTotal(searchData.total)
    }
  }, [search, searchData, isSearchLoading])

  useEffect(() => {
    if (tag && tag !== "all" && tagData && usersData && !isTagLoading) {
      const postsWithUsers = tagData.posts.map((post: any) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(tagData.total)
    }
  }, [tag, tagData, usersData, isTagLoading])

  const searchPosts = async () => {
    if (!search) {
      fetchPosts()
      return
    }
    // React Query가 이미 데이터를 가져왔으면 사용
    if (searchData) {
      setPosts(searchData.posts)
      setTotal(searchData.total)
    }
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    // React Query가 이미 데이터를 가져왔으면 사용
    if (tagData && usersData) {
      const postsWithUsers = tagData.posts.map((post: any) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(tagData.total)
    }
  }

  const deletePostMutation = useDeletePostMutation()

  const deletePost = async (id: number) => {
    try {
      await deletePostMutation.mutateAsync({ id })
      // 상태 직접 업데이트 (캐시 무효화는 mutation에서 처리)
      setPosts(posts.filter((post: any) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  useEffect(() => {
    initializeFromURL()

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
